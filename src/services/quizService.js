const fs = require('fs').promises;
const path = require('path');

class QuizService {
    constructor() {
        this.quizzes = new Map();
        this.quizzesDir = path.join(__dirname, '../data/quizzes');
        this.initialized = false;

        // Exam configuration for each topic
        this.examConfig = {
            'Topic 1. Öffentliche Sicherheit und Ordnung': { total: 14, weight1: 4, weight2: 10 },
            'Topic 2. Umgang mit Menschen': { total: 10, weight1: 5, weight2: 5 },
            'Topic 3. Datenschutz': { total: 5, weight1: 4, weight2: 1 },
            'Topic 4. Gewerberecht': { total: 8, weight1: 5, weight2: 3 },
            'Topic 5. Strafgesetzbuch': { total: 12, weight1: 3, weight2: 9 },
            'Topic 6. Bürgeleriches Gesetzbuch': { total: 12, weight1: 3, weight2: 9 },
            'Topic 7. Sicherheitstechnik': { total: 8, weight1: 6, weight2: 2 },
            'Topic 8. Unfallverhütungsvorschriften': { total: 8, weight1: 7, weight2: 1 },
            'Topic 9. Umgang mit Verteidigungswaffen': { total: 5, weight1: 3, weight2: 2 }
        };
    }

    async initialize() {
        if (!this.initialized) {
            await this.loadQuizzes();
            this.initialized = true;
        }
    }

    async loadQuizzes() {
        try {
            // Read all quiz files from the quizzes directory
            const files = await fs.readdir(this.quizzesDir);
            
            // Topic mapping for file names and quiz titles
            const topicMap = {
                'Topic 1. Öffentliche Sicherheit und Ordnung.json': 'Topic 1. Öffentliche Sicherheit und Ordnung',
                'Topic 2. Umgang mit Menschen.json': 'Topic 2. Umgang mit Menschen',
                'Topic 3. Datenschutz.json': 'Topic 3. Datenschutz',
                'Topic 4. Gewerberecht.json': 'Topic 4. Gewerberecht',
                'Topic 5. Strafgesetzbuch.json': 'Topic 5. Strafgesetzbuch',
                'Topic 6. Bürgeleriches Gesetzbuch.json': 'Topic 6. Bürgeleriches Gesetzbuch',
                'Topic 7. Sicherheitstechnik.json': 'Topic 7. Sicherheitstechnik',
                'Topic 8. Unfallverhütungsvorschriften.json': 'Topic 8. Unfallverhütungsvorschriften',
                'Topic 9. Umgang mit Verteidigungswaffen.json': 'Topic 9. Umgang mit Verteidigungswaffen',
            };

            // Title to topic mapping
            const titleMap = {
                'Sachkundeprüfung 34a - Öffentliche Sicherheit und Ordnung': 'Topic 1. Öffentliche Sicherheit und Ordnung'
            };
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(this.quizzesDir, file);
                    const data = await fs.readFile(filePath, 'utf8');
                    const quiz = JSON.parse(data);
                    const topic = topicMap[file] || titleMap[quiz.quiz_title] || quiz.quiz_title;
                    
                    // Debug log for Topic 1
                    if (file.includes('Topic 1')) {
                        console.log('Loading Topic 1:', {
                            file,
                            quizTitle: quiz.quiz_title,
                            mappedTopic: topic,
                            questionsCount: quiz.questions?.length
                        });
                    }
                    
                    // Add topic prefix to question IDs to make them unique across all topics
                    const topicPrefix = topic.split('.')[0].trim(); // e.g., 'Topic 1'
                    quiz.questions = quiz.questions.map((q, index) => ({
                        ...q,
                        id: `${topicPrefix}_${index + 1}` // e.g., 'Topic 1_1', 'Topic 1_2', etc.
                    }));
                    
                    this.quizzes.set(topic, quiz);
                    console.log(`Loaded quiz: ${topic} with ${quiz.questions.length} questions`);
                }
            }
            console.log('Quizzes loaded successfully');
        } catch (error) {
            console.error('Error loading quizzes:', error);
            throw error;
        }
    }

    async getQuizByTopic(topic) {
        await this.initialize();
        return this.quizzes.get(topic);
    }

    async getTopics() {
        await this.initialize();
        return Array.from(this.quizzes.keys());
    }

    async getRandomQuestions(topic = null, count = 10, isExam = false) {
        await this.initialize();
        
        let selectedQuestions = [];

        if (isExam) {
            // For exam mode, get questions randomly from all topics
            const allQuestions = [];
            let totalWeight1 = 0;
            let totalWeight2 = 0;
            
            // Calculate total questions needed with each weightage
            for (const config of Object.values(this.examConfig)) {
                totalWeight1 += config.weight1;
                totalWeight2 += config.weight2;
            }
            
            // Get all questions from all topics
            for (const [topic, quiz] of this.quizzes.entries()) {
                const questions = quiz.questions.map(q => ({ ...q, topic }));
                allQuestions.push(...questions);
            }
            
            // Shuffle all questions
            const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
            
            // Take required number of questions and assign weightages
            const totalNeeded = totalWeight1 + totalWeight2;
            const selected = shuffledQuestions.slice(0, totalNeeded);
            
            // Assign weightages: first totalWeight1 questions get weightage 1,
            // remaining get weightage 2
            selectedQuestions = [
                ...selected.slice(0, totalWeight1).map(q => ({ ...q, weightage: 1 })),
                ...selected.slice(totalWeight1).map(q => ({ ...q, weightage: 2 }))
            ];
        } else if (topic) {
            // For practice mode with specific topic
            const quiz = this.quizzes.get(topic);
            if (!quiz) return null;
            selectedQuestions = quiz.questions
                .sort(() => Math.random() - 0.5)
                .slice(0, count)
                .map(q => ({ ...q, topic }));
        } else {
            // For practice mode with random topics
            const allQuestions = [];
            for (const quiz of this.quizzes.values()) {
                allQuestions.push(...quiz.questions.map(q => ({
                    ...q,
                    topic: quiz.quiz_title
                })));
            }
            selectedQuestions = allQuestions
                .sort(() => Math.random() - 0.5)
                .slice(0, count);
        }

        return selectedQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            topic: q.topic,
            weightage: q.weightage || 1 // Include weightage in response
        }));
    }

    getTopicFromQuestionId(questionId) {
        // Extract topic number from question ID (e.g., 'Topic 2_6' -> 'Topic 2')
        const match = questionId.match(/^Topic (\d+)/i);
        if (!match) return null;

        // Map topic numbers to full topic names
        const topicMap = {
            '1': 'Topic 1. Öffentliche Sicherheit und Ordnung',
            '2': 'Topic 2. Umgang mit Menschen',
            '3': 'Topic 3. Datenschutz',
            '4': 'Topic 4. Gewerberecht',
            '5': 'Topic 5. Strafgesetzbuch',
            '6': 'Topic 6. Bürgeleriches Gesetzbuch',
            '7': 'Topic 7. Sicherheitstechnik',
            '8': 'Topic 8. Unfallverhütungsvorschriften',
            '9': 'Topic 9. Umgang mit Verteidigungswaffen'
        };

        return topicMap[match[1]] || null;
    }

    async validateAnswers(topic, answers, isExam = false) {
        await this.initialize();

        if (!answers || !Array.isArray(answers)) {
            throw new Error('Invalid answers format');
        }

        const validAnswers = answers.filter(answer => {
            if (!answer || !answer.questionId) {
                console.error('Invalid answer format:', answer);
                return false;
            }
            return true;
        });

        if (validAnswers.length === 0) {
            throw new Error('No valid answers provided');
        }

        // For multi-topic submissions, validate each answer against its topic
        if (!topic) {
            const topicResults = new Map(); // Group results by topic
            const unattemptedQuestions = new Set(); // Track unattempted questions
            let totalScore = 0;
            let totalPossibleScore = 0;
            
            // First, collect all available questions
            for (const [topicName, quiz] of this.quizzes.entries()) {
                quiz.questions.forEach(q => unattemptedQuestions.add(q.id));
            }
            
            for (const answer of validAnswers) {
                const answerTopic = answer.topic || this.getTopicFromQuestionId(answer.questionId);
                if (!answerTopic) {
                    console.error(`Could not determine topic for question ${answer.questionId}`);
                    continue;
                }

                const quiz = this.quizzes.get(answerTopic);
                if (!quiz) {
                    console.error(`Quiz ${answerTopic} not found`);
                    continue;
                }

                const question = quiz.questions.find(q => q.id === answer.questionId);
                if (!question) {
                    console.error(`Question ${answer.questionId} not found in quiz ${answerTopic}`);
                    continue;
                }
                
                // Remove this question from unattempted set since it was answered
                unattemptedQuestions.delete(answer.questionId);

                const weightage = question.weightage || 1;
                
                // Handle multiple selected answers
                const selectedAnswers = answer.selectedAnswers || [];
                
                // Calculate partial credit for multiple correct answers
                const correctAnswers = question.correct_answers || [];
                
                // Empty array is a wrong answer (no selection made)
                let result;
                if (selectedAnswers.length === 0) {
                    result = {
                        questionId: answer.questionId,
                        isCorrect: false,
                        isPartiallyCorrect: false,
                        score: 0,
                        selectedAnswers: [],
                        correctAnswers: correctAnswers,
                        explanation: 'No answer selected',
                        weightage
                    };
                } else {
                    // Calculate score based on correct selections and avoiding wrong ones
                    const correctSelections = selectedAnswers.filter(opt => correctAnswers.includes(opt));
                    const wrongSelections = selectedAnswers.filter(opt => !correctAnswers.includes(opt));
                    
                    // Full score if:
                    // 1. At least one correct answer is selected and no wrong ones
                    // Example: If B and D are correct, selecting B or D or both is correct
                    const hasCorrectAnswer = correctSelections.length > 0;
                    const hasNoWrongAnswers = wrongSelections.length === 0;
                    const isCorrect = hasCorrectAnswer && hasNoWrongAnswers;
                    
                    // Give full score if any correct answer is selected and no wrong answers
                    // No score if any wrong answer is selected
                    const score = wrongSelections.length > 0 ? 0 : 
                                 isCorrect ? weightage : 0;

                    result = {
                        questionId: answer.questionId,
                        isCorrect: isCorrect,
                        isPartiallyCorrect: false, // No partial credit needed since any correct answer is fully correct
                        score: score,
                        selectedAnswers: selectedAnswers,
                        correctAnswers: correctAnswers,
                        explanation: isCorrect ? (question.explanation || null) : null,
                        weightage
                    };
                }

                if (!topicResults.has(answerTopic)) {
                    topicResults.set(answerTopic, {
                        topic: answerTopic,
                        score: 0,
                        total: 0,
                        results: []
                    });
                }

                const topicResult = topicResults.get(answerTopic);
                topicResult.results.push(result);
                topicResult.score += result.score;
                topicResult.total += result.weightage;
            }

            // Convert topic results to flat array of question results
            const allResults = [];

            for (const topicResult of topicResults.values()) {
                for (const result of topicResult.results) {
                    allResults.push({
                        ...result,
                        topic: topicResult.topic
                    });
                    if (result.isCorrect) totalScore += result.weightage;
                    totalPossibleScore += result.weightage;
                }
            }

            const scorePercentage = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;
            const passed = isExam ? scorePercentage >= 50 : true; // Pass threshold is 50% for exams

            return {
                score: totalScore,
                total: totalPossibleScore,
                results: allResults,
                unattemptedQuestions: Array.from(unattemptedQuestions),
                passed,
                scorePercentage
            };
        }

        // Topic-specific submission
        const quiz = this.quizzes.get(topic);
        if (!quiz) return null;

        // Track unattempted questions for this topic
        const unattemptedQuestions = new Set(quiz.questions.map(q => q.id));

        const results = validAnswers.map(answer => {
            const question = quiz.questions.find(q => q.id === answer.questionId);
            if (!question) {
                console.error(`Question ${answer.questionId} not found in quiz ${topic}`);
                return null;
            }
            
            // Remove this question from unattempted set since it was answered
            unattemptedQuestions.delete(answer.questionId);

            const weightage = question.weightage || 1;
            
            // Handle multiple selected options
            const selectedAnswers = answer.selectedAnswers || [];
            
            // Calculate partial credit for multiple correct answers
            const correctAnswers = question.correct_answers || [];
            
            // Empty array is a wrong answer (no selection made)
            if (selectedAnswers.length === 0) {
                return {
                    questionId: answer.questionId,
                    isCorrect: false,
                    isPartiallyCorrect: false,
                    score: 0,
                    selectedAnswers: [],
                    correctAnswers: correctAnswers,
                    explanation: 'No answer selected',
                    weightage,
                    topic: topic // Add topic for reference
                };
            }
            
            // Calculate score based on correct selections and avoiding wrong ones
            const correctSelections = selectedAnswers.filter(opt => correctAnswers.includes(opt));
            const wrongSelections = selectedAnswers.filter(opt => !correctAnswers.includes(opt));
            
            // Full score if:
            // 1. At least one correct answer is selected and no wrong ones
            // Example: If B and D are correct, selecting B or D or both is correct
            const hasCorrectAnswer = correctSelections.length > 0;
            const hasNoWrongAnswers = wrongSelections.length === 0;
            const isCorrect = hasCorrectAnswer && hasNoWrongAnswers;
            
            // Give full score if any correct answer is selected and no wrong answers
            // No score if any wrong answer is selected
            const score = wrongSelections.length > 0 ? 0 : 
                         isCorrect ? weightage : 0;

            return {
                questionId: answer.questionId,
                isCorrect: isCorrect,
                isPartiallyCorrect: false, // No partial credit needed since any correct answer is fully correct
                score: score,
                selectedAnswers: selectedAnswers,
                correctAnswers: correctAnswers,
                explanation: isCorrect ? (question.explanation || null) : null,
                weightage,
                topic: topic // Add topic for reference
            };
        }).filter(r => r !== null); // Remove null results

        const validResults = results.filter(r => r !== null);
        let totalScore = 0;
        let totalPossibleScore = 0;

        // Calculate total scores from valid results
        for (const result of validResults) {
            if (result.isCorrect) totalScore += result.weightage;
            totalPossibleScore += result.weightage;
        }

        const scorePercentage = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;
        const passed = isExam ? scorePercentage >= 50 : true; // Pass threshold is 50% for exams

        return {
            score: totalScore,
            total: totalPossibleScore,
            results: validResults,
            unattemptedQuestions: Array.from(unattemptedQuestions),
            passed,
            scorePercentage
        };
    }
}

module.exports = new QuizService();
