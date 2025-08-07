const  QuizAttempt  = require('../../models/QuizAttempt');
const quizService = require('../../services/quizService');
const db = require('../../config/database');

class QuizController {
    async getTopics(req, res) {
        const connection = await db.getConnection();
        try {
            const topics = await quizService.getTopics();
            res.json({ topics });
        } catch (error) {
            console.error('Error getting quiz topics:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.release();
        }
    }

    async getQuizByTopic(req, res) {
        const connection = await db.getConnection();
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
        } finally {
            connection.release();
        }
    }

    async getRandomQuestions(req, res) {
        const connection = await db.getConnection();
        try {
            const { topic } = req.params;
            const { isExam } = req.query;
            const count = parseInt(req.query.count) || 10;

            // If isExam=true, get exam questions with specific counts and weightages per topic
            const questions = await quizService.getRandomQuestions(
                topic === 'all' ? null : topic,
                count,
                isExam === 'true'
            );

            if (!questions) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            res.json({ 
                questions,
                totalQuestions: questions.length,
                isExam: isExam === 'true'
            });
        } catch (error) {
            console.error('Error getting random questions:', error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.release();
        }
    }

    async getResults(req, res) {
        const connection = await db.getConnection();
        try {
            // Validate student from auth token
            if (!req.user || !req.user.student_id) {
                return res.status(401).json({ error: 'No student ID found in auth token' });
            }
            
            const studentId = req.user.student_id; // From auth middleware
            
            // Get all results grouped by topic
            const results = await QuizAttempt.getStudentResults(studentId);
            
            return res.json({
                success: true,
                results
            });
        } catch (error) {
            console.error('Error getting quiz results:', error);
            return res.status(500).json({
                error: 'Internal server error',
                details: 'Failed to get quiz results'
            });
        } finally {
            connection.release();
        }
    }

    async submitAnswers(req, res) {
        const connection = await db.getConnection();
        try {
            const { topic } = req.params;
            const { answers, isExam = false } = req.body;
            
            // Validate answers array
            if (!answers || !Array.isArray(answers)) {
                return res.status(400).json({
                    error: 'Invalid answers format',
                    details: 'Answers must be provided as an array'
                });
            }

            // Check for empty answers array
            if (answers.length === 0) {
                return res.status(400).json({
                    error: 'No answers provided',
                    details: 'You must submit at least one answer'
                });
            }

            // Validate each answer has required fields and proper format
            const answerValidationErrors = answers.filter(answer => {
                return !answer || 
                    typeof answer.questionId === 'undefined' || 
                    !Array.isArray(answer.selectedAnswers);
            });

            if (answerValidationErrors.length > 0) {
                return res.status(400).json({
                    error: 'Invalid answer format',
                    details: 'Each answer must have a questionId and selectedAnswers array'
                });
            }

            // In exam mode, require at least one answer for each question
   
            if (answerValidationErrors.length > 0) {
                return res.status(400).json({
                    error: 'Invalid answer format',
                    details: 'Each answer must have questionId and selectedAnswers array'
                });
            }

            // For practice mode, validate that answers are not empty
            if (!isExam) {
                const emptyAnswers = answers.filter(answer => 
                    !answer.selectedAnswers || answer.selectedAnswers.length === 0
                );

            
            }
            
            // Validate student from auth token
            if (!req.user || !req.user.student_id) {
                return res.status(401).json({ error: 'No student ID found in auth token' });
            }
            
            const studentId = req.user.student_id; // From auth middleware
            
            // Verify student exists in database
            let students;
            try {
                [students] = await connection.execute(
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

            console.log('Full request body:', JSON.stringify(req.body, null, 2));

            // Validate answer format
            const invalidAnswers = answers.filter(answer => {
                console.log('\nValidating answer:', JSON.stringify(answer, null, 2));
                
                // Check if answer is properly structured
                if (!answer || typeof answer !== 'object') {
                    console.log('Invalid: answer is not an object');
                    return true;
                }

                // Check questionId
                if (typeof answer.questionId !== 'string') {
                    console.log('Invalid: questionId is not a string, got:', typeof answer.questionId);
                    console.log('questionId value:', answer.questionId);
                    return true;
                }

                // Initialize selectedOptions as empty array if missing
                if (!answer.selectedOptions) {
                    answer.selectedOptions = [];
                }
                
                // Ensure selectedOptions is an array
                if (!Array.isArray(answer.selectedOptions)) {
                    console.log('Invalid: selectedOptions is not an array, got:', typeof answer.selectedOptions);
                    console.log('selectedOptions value:', answer.selectedOptions);
                    return true;
                }

                // Check array elements are strings
                if (answer.selectedOptions.length > 0 && 
                    answer.selectedOptions.some(opt => typeof opt !== 'string')) {
                    console.log('Invalid: some options are not strings');
                    console.log('selectedOptions:', answer.selectedOptions);
                    return true;
                }

                console.log('Answer is valid');
                return false;
            });

            if (invalidAnswers.length > 0) {
                const invalidQuestionIds = invalidAnswers.map(a => a.questionId).join(', ');
                return res.status(400).json({
                    error: 'Invalid answer format',
                    details: `Each answer must include: questionId (string) and selectedOptions (array of strings). Invalid answers for questions: ${invalidQuestionIds}`
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

            // For multi-topic submissions, pass null as topic
            const validationResult = await quizService.validateAnswers(topic || null, answersToProcess, isExam);
            if (!validationResult || !validationResult.results || !Array.isArray(validationResult.results)) {
                return res.status(400).json({
                    error: 'Validation error',
                    details: 'Invalid response from quiz validation'
                });
            }

            // Get scores and results from validation
            const { results: questionResults } = validationResult;

            if (!questionResults || questionResults.length === 0) {
                return res.status(400).json({
                    error: 'No answers provided',
                    details: 'You must submit at least one answer'
                });
            }

            // Group results by topic
            const resultsByTopic = {};
            for (const result of questionResults) {
                if (!result.topic) {
                    console.warn('Question result missing topic:', result);
                    continue;
                }
                
                if (!resultsByTopic[result.topic]) {
                    resultsByTopic[result.topic] = {
                        topic: result.topic,
                        score: 0,
                        total: 0,
                        results: [],
                        unattemptedQuestions: []
                    };
                }
                
                // Add to topic totals
                const weightage = result.weightage || 1;
                resultsByTopic[result.topic].total += weightage;
                
                // Add score if question was answered correctly
                if (result.isCorrect || result.isPartiallyCorrect) {
                    resultsByTopic[result.topic].score += result.score || 0;
                }
                
                resultsByTopic[result.topic].results.push(result);
                
                // Track unattempted questions
                if (!result.selectedAnswers || result.selectedAnswers.length === 0) {
                    resultsByTopic[result.topic].unattemptedQuestions.push(result.questionId);
                }
            }

            // Convert to array and calculate percentages
            const allResults = Object.values(resultsByTopic)
                .filter(topicResult => topicResult.total > 0) // Only include topics with questions
                .map(topicResult => ({
                    topic: topicResult.topic,
                    score: topicResult.score,
                    total: topicResult.total,
                    percentage: (topicResult.score / topicResult.total) * 100,
                    results: topicResult.results,
                    unattemptedQuestions: topicResult.unattemptedQuestions
                }));

            // Save attempts with retry logic
            let attemptSaved = false;
            let attempt = 0;
            const maxAttempts = 3;

            while (!attemptSaved && attempt < maxAttempts) {
                try {
                    if (isExam) {
                        // For exam attempts, combine all results into one attempt
                        const totalScore = allResults.reduce((sum, result) => sum + result.score, 0);
                        const totalQuestions = allResults.reduce((sum, result) => sum + result.total, 0);
                        const allUnattempted = allResults.reduce((all, result) => 
                            [...all, ...result.unattemptedQuestions], []);

                        console.log('Saving exam attempt:', {
                            score: totalScore,
                            total: totalQuestions,
                            unattemptedCount: allUnattempted.length
                        });

                        await QuizAttempt.create({
                            student_id: studentId,
                            score: totalScore,
                            total_questions: totalQuestions,
                            is_exam: true,
                            topic: "exam",
                            unattempted_questions: allUnattempted,
                            attempt_date: new Date()
                        });
                    } else {
                        // For practice attempts, save each topic separately
                        for (const topicResult of allResults) {
                            console.log('Saving practice attempt for topic:', {
                                topic: topicResult.topic,
                                score: topicResult.score,
                                total: topicResult.total,
                                unattemptedCount: topicResult.unattemptedQuestions.length
                            });

                            await QuizAttempt.create({
                                student_id: studentId,
                                topic: topicResult.topic,
                                score: topicResult.score,
                                total_questions: topicResult.total,
                                is_exam: false,
                                unattempted_questions: topicResult.unattemptedQuestions,
                                attempt_date: new Date()
                            });
                        }
                    }
                    attemptSaved = true;
                } catch (error) {
                    attempt++;
                    console.error('Quiz attempt save error details:', {
                        error: error.message,
                        stack: error.stack,
                        code: error.code,
                        sqlMessage: error.sqlMessage,
                        sqlState: error.sqlState
                    });

                    if (attempt === maxAttempts - 1) {
                        return res.status(500).json({
                            error: 'Failed to save quiz attempt',
                            details: error.message
                        });
                    }

                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }

            // Calculate total scores for response
            const totalScore = allResults.reduce((sum, result) => sum + result.score, 0);
            const totalQuestions = allResults.reduce((sum, result) => sum + result.total, 0);
            const allUnattempted = allResults.reduce((all, result) => 
                [...all, ...result.unattemptedQuestions], []);
            const scorePercentage = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

            // Return success response with results
            return res.status(200).json({
                message: 'Quiz attempt saved successfully',
                score: totalScore,
                total: totalQuestions,
                passed: scorePercentage >= 50,
                scorePercentage,
                unattemptedCount: allUnattempted.length,
                results: allResults.flatMap(result => result.results)
            });
        } catch (error) {
            console.error('Error submitting answers:', error);
            return res.status(500).json({ error: 'Internal server error' });
        } finally {
            connection.release();
        }
    }
}

module.exports = new QuizController();
