const fs = require('fs').promises;
const path = require('path');

class QuizService {
    constructor() {
        this.quizzes = new Map();
        this.quizzesDir = path.join(__dirname, '../data/quizzes');
        this.initialized = false;
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
            
            // Topic mapping for file names
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
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(this.quizzesDir, file);
                    const data = await fs.readFile(filePath, 'utf8');
                    const quiz = JSON.parse(data);
                    const topic = topicMap[file] || quiz.quiz_title;
                    this.quizzes.set(topic, quiz);
                    console.log(`Loaded quiz: ${topic}`);
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

    async getRandomQuestions(topic = null, count = 10) {
        await this.initialize();
        
        let allQuestions = [];
        if (topic) {
            const quiz = this.quizzes.get(topic);
            if (!quiz) return null;
            allQuestions = [...quiz.questions];
        } else {
            // Get questions from all topics
            for (const quiz of this.quizzes.values()) {
                allQuestions.push(...quiz.questions.map(q => ({
                    ...q,
                    topic: quiz.quiz_title // Add topic to identify where question came from
                })));
            }
        }

        return allQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(count, allQuestions.length))
            .map(q => ({
                id: q.id,
                question: q.question,
                options: q.options,
                topic: q.topic // Include topic in response
                // Note: We don't send correct_answers to students
            }));
    }

    getTopicFromQuestionId(questionId) {
        // Map question ID prefixes to topics
        const prefixMap = {
            'GEW_': 'Gewerberecht',
            'ROSO_': 'Recht der öffentlichen Sicherheit und Ordnung'
        };

        for (const [prefix, topic] of Object.entries(prefixMap)) {
            if (questionId.startsWith(prefix)) {
                return topic;
            }
        }
        return null;
    }

    async validateAnswers(topic, answers) {
        await this.initialize();

        // Ensure answers is an array and all required fields are present
        if (!Array.isArray(answers)) {
            console.error('Answers must be an array');
            return null;
        }

        const validAnswers = answers.filter(answer => {
            return answer && 
                   typeof answer.questionId === 'string' && 
                   typeof answer.selectedOption === 'string';
        });

        if (validAnswers.length === 0) {
            console.error('No valid answers found');
            return {
                score: 0,
                total: 0,
                results: []
            };
        }

        // For multi-topic submissions, validate each answer against its topic
        if (!topic) {
            const results = [];
            let totalScore = 0;
            let totalQuestions = 0;

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

                const isCorrect = Array.isArray(question.correct_answers) && 
                                 question.correct_answers.includes(answer.selectedOption);
                results.push({
                    questionId: answer.questionId,
                    topic: answerTopic,
                    isCorrect: isCorrect || false,
                    explanation: isCorrect ? (question.explanation || null) : null
                });

                if (isCorrect) totalScore++;
                totalQuestions++;
            }

            return {
                score: totalScore,
                total: totalQuestions,
                results
            };
        }

        // Topic-specific submission
        const quiz = this.quizzes.get(topic);
        if (!quiz) return null;

        const results = validAnswers.map(answer => {
            const question = quiz.questions.find(q => q.id === answer.questionId);
            if (!question) {
                console.error(`Question ${answer.questionId} not found in quiz ${topic}`);
                return null;
            }

            const isCorrect = Array.isArray(question.correct_answers) && 
                             question.correct_answers.includes(answer.selectedOption);
            return {
                questionId: answer.questionId,
                isCorrect: isCorrect || false,
                explanation: isCorrect ? (question.explanation || null) : null
            };
        }).filter(r => r !== null); // Remove null results

        const score = results.filter(r => r.isCorrect).length;
        const total = results.length;

        return {
            score: score || 0,
            total: total || 0,
            results: results || []
        };
    }


}

module.exports = new QuizService();
