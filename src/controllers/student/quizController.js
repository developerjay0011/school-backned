const  QuizAttempt  = require('../../models/QuizAttempt');
const quizService = require('../../services/quizService');
const db = require('../../config/database');

class QuizController {
    async getTopics(req, res) {
        try {
            const topics = await quizService.getTopics();
            res.json({ topics });
        } catch (error) {
            console.error('Error getting quiz topics:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getQuizByTopic(req, res) {
        try {
            const { topic } = req.params;
            const quiz = await quizService.getQuizByTopic(topic);
            
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            res.json({
                quiz_title: quiz.quiz_title,
                total_questions: quiz.total_questions,
                questions: quiz.questions.map(q => ({
                    id: q.id,
                    question: q.question,
                    options: q.options
                }))
            });
        } catch (error) {
            console.error('Error getting quiz:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getRandomQuestions(req, res) {
        try {
            const { topic } = req.params;
            const count = parseInt(req.query.count) || 10;

            // If topic is 'all', pass null to get questions from all topics
            const questions = await quizService.getRandomQuestions(topic === 'all' ? null : topic, count);
            if (!questions) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            res.json({ questions });
        } catch (error) {
            console.error('Error getting random questions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async submitAnswers(req, res) {
        try {
            const { topic } = req.params;
            const { answers, isExam = false } = req.body;
            
            // Validate student from auth token
            if (!req.user || !req.user.student_id) {
                return res.status(401).json({ error: 'No student ID found in auth token' });
            }
            
            const studentId = req.user.student_id; // From auth middleware
            
            // Verify student exists in database
            let students;
            try {
                [students] = await db.execute(
                    'SELECT student_id FROM student WHERE student_id = ?',
                    [studentId]
                );
            } catch (error) {
                console.error('Database error checking student:', error);
                return res.status(500).json({
                    error: 'Database connection error',
                    details: 'Failed to verify student. Please try again.'
                });
            }

            if (!students || students.length === 0) {
                return res.status(404).json({ 
                    error: 'Student not found',
                    details: 'The student ID from your auth token was not found in the database'
                });
            }

            if (!Array.isArray(answers)) {
                return res.status(400).json({ error: 'Answers must be an array' });
            }

            // Validate answer format
            const invalidAnswerFormat = answers.some(answer => {
                return !answer || 
                       typeof answer.questionId !== 'string' || 
                       typeof answer.selectedOption !== 'string';
            });

            if (invalidAnswerFormat) {
                return res.status(400).json({
                    error: 'Invalid answer format',
                    details: 'Each answer must have a questionId (string) and selectedOption (string)'
                });
            }

            // Get all topics for validation
            const allTopics = await quizService.getTopics();

            // Validate and transform answers
            let answersToProcess = answers;
            if (topic) {
                // If topic is in URL, use it for all answers
                answersToProcess = answers.map(a => ({
                    ...a,
                    topic
                }));
            } else {
                // For multi-topic submissions, topic will be inferred from question IDs
                answersToProcess = answers;
            }

            // Let the quiz service handle topic inference and validation
            const results = await quizService.validateAnswers(topic, answersToProcess);
            if (!results) {
                return res.status(400).json({
                    error: 'Failed to validate answers',
                    details: 'Could not validate some answers. Please check question IDs.'
                });
            }

            let totalScore = results.score;
            let totalQuestions = results.total;
            const allResults = topic ? [{
                topic,
                score: results.score,
                total: results.total,
                results: results.results
            }] : results.results;

            // For storing attempts, group answers by topic
            const answersByTopic = {};
            if (topic) {
                answersByTopic[topic] = answersToProcess;
            } else {
                // Group by inferred topics
                for (const result of allResults) {
                    if (!answersByTopic[result.topic]) {
                        answersByTopic[result.topic] = [];
                    }
                    // Find corresponding answers
                    const topicAnswers = answersToProcess.filter(a => {
                        const questionTopic = a.topic || quizService.getTopicFromQuestionId(a.questionId);
                        return questionTopic === result.topic;
                    });
                    answersByTopic[result.topic].push(...topicAnswers);
                }
            }

            // Save attempt to database with retry logic
            const maxRetries = 3;
            let attempt = 0;
            let attemptSaved = false;

            while (attempt < maxRetries && !attemptSaved) {
                try {
                    await QuizAttempt.create({
                        student_id: studentId,
                        topic: topic || 'multiple', // Use 'multiple' for multi-topic quizzes
                        score: totalScore,
                        total_questions: totalQuestions,
                        is_exam: isExam,
                        attempt_date: new Date()
                    });
                    attemptSaved = true;
                } catch (error) {
                    attempt++;
                    if (attempt === maxRetries) {
                        console.error('Failed to save quiz attempt after retries:', error);
                        return res.status(500).json({
                            error: 'Database error',
                            details: 'Failed to save quiz attempt. Please try again.'
                        });
                    }
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            }

            // Get all attempts for all topics
            const attempts = {};
            const bestScores = {};
            for (const topicName of Object.keys(answersByTopic)) {
                attempts[topicName] = await QuizAttempt.getStudentAttempts(studentId, topicName);
                bestScores[topicName] = await QuizAttempt.getBestScore(studentId, topicName);
            }

            // For topic-specific endpoint, simplify the response
            if (topic) {
                if (allResults.length === 0) {
                    return res.status(404).json({ error: 'No results found for the given topic' });
                }
                const topicResults = allResults[0];
                if (!topicResults) {
                    return res.status(404).json({ error: 'No results found for the given topic' });
                }
                return res.json({
                    score: topicResults.score,
                    total: topicResults.total,
                    results: topicResults.results,
                    bestScore: bestScores[topic] || { score: 0, total_questions: 0 },
                    attempts: attempts[topic] || [],
                    isExam
                });
            }

            // For multi-topic endpoint, return full response
            return res.json({
                totalScore,
                totalQuestions,
                results: allResults,
                bestScores,
                attempts,
                isExam
            });
        } catch (error) {
            console.error('Error submitting answers:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new QuizController();
