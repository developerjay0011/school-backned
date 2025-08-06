const db = require('../config/database');

class QuizAttempt {
    static async create({ student_id, topic, score, total_questions, is_exam, unattempted_questions = [], attempt_date = new Date() }) {
        const query = `
            INSERT INTO quiz_attempts (
                student_id, quiz_topic, score, total_questions, is_exam,
                unattempted_questions_count, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Validate input parameters with detailed error messages
        if (!student_id) {
            throw new Error('Missing student_id for quiz attempt');
        }
        if (!topic) {
            throw new Error('Missing topic for quiz attempt');
        }
        if (score === undefined) {
            throw new Error('Missing score for quiz attempt');
        }
        if (!total_questions) {
            throw new Error('Missing total_questions for quiz attempt');
        }

        // Validate score and total_questions are non-negative numbers
        if (score < 0 || !Number.isFinite(score)) {
            throw new Error(`Invalid score value: ${score}. Score must be a non-negative number.`);
        }
        if (total_questions < 0 || !Number.isFinite(total_questions)) {
            throw new Error(`Invalid total_questions value: ${total_questions}. Total questions must be a non-negative number.`);
        }

        // Ensure score doesn't exceed total_questions
        if (score > total_questions) {
            console.warn(`Warning: Score (${score}) exceeds total questions (${total_questions}) for topic ${topic}. Capping at total.`);
            score = total_questions;
        }

        // Ensure unattempted_questions is an array and count doesn't exceed total
        if (!Array.isArray(unattempted_questions)) {
            unattempted_questions = [];
        }
        const unattemptedCount = unattempted_questions.length;
        if (unattemptedCount > total_questions) {
            console.warn(`Warning: Unattempted questions count (${unattemptedCount}) exceeds total questions (${total_questions}) for topic ${topic}. Capping at total.`);
            unattempted_questions = unattempted_questions.slice(0, total_questions);
        }

        // Add retry logic for connection issues
        let retries = 3;
        let lastError;

        while (retries > 0) {
            try {
                const [result] = await db.execute(query, [
                    student_id,
                    topic,
                    score,
                    total_questions,
                    is_exam,
                    Array.isArray(unattempted_questions) ? unattempted_questions.length : 0,
                    attempt_date
                ]);
                return result.insertId;
            } catch (error) {
                lastError = error;
                if (error.code === 'ECONNRESET' && retries > 1) {
                    // Wait for a short time before retrying
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 100));
                    retries--;
                    continue;
                }
                break;
            }
        }

        // If we get here, all retries failed
        throw lastError || new Error('Failed to save quiz attempt');
    }

    static async getStudentAttempts(studentId, quizTopic) {
        const query = `
            SELECT * FROM quiz_attempts
            WHERE student_id = ? AND quiz_topic = ?
            ORDER BY created_at DESC
        `;
        const [attempts] = await db.execute(query, [studentId, quizTopic]);
        return attempts;
    }

    static async hasExamAttempt(studentId, quizTopic) {
        const query = `
            SELECT COUNT(*) as count FROM quiz_attempts
            WHERE student_id = ? AND quiz_topic = ? AND is_exam = TRUE
        `;
        const [[result]] = await db.execute(query, [studentId, quizTopic]);
        return result.count > 0;
    }

    static async getBestScore(studentId, quizTopic) {
        const query = `
            SELECT score, total_questions FROM quiz_attempts
            WHERE student_id = ? AND quiz_topic = ?
            ORDER BY (score / total_questions) DESC
            LIMIT 1
        `;
        const [[result]] = await db.execute(query, [studentId, quizTopic]);
        return result;
    }

    static async getStudentResults(studentId) {
        const query = `
            SELECT
                qa.*,
                ROUND((qa.score / qa.total_questions) * 100, 2) as percentage
            FROM quiz_attempts qa
            WHERE qa.student_id = ?
            ORDER BY qa.created_at DESC
        `;

        try {
            const [attempts] = await db.execute(query, [studentId]);
            
            // Separate exam and practice attempts
            const examAttempts = [];
            const practiceAttempts = [];
            
            for (const attempt of attempts) {
                const attemptData = {
                    id: attempt.id,
                    student_id: attempt.student_id,
                    score: attempt.score,
                    total_questions: attempt.total_questions,
                    percentage: parseFloat(attempt.percentage),
                    status: attempt.percentage > 50 ? 'pass' : 'fail',
                    is_exam: attempt.is_exam === 1,
                    unattempted_questions_count: attempt.unattempted_questions_count + (attempt.total_questions - attempt.score - attempt.unattempted_questions_count),
                    wrong_questions_count: attempt.total_questions - attempt.score - attempt.unattempted_questions_count,
                    created_at: attempt.created_at,
                    updated_at: attempt.updated_at
                };

                // Add topic only for practice attempts
                if (attempt.is_exam === 1) {
                    examAttempts.push(attemptData);
                } else {
                    practiceAttempts.push({
                        ...attemptData,
                        topic: attempt.quiz_topic // Include topic only for practice attempts
                    });
                }
            }

            // Shuffle exam attempts to ensure random order
            examAttempts.sort(() => Math.random() - 0.5);
            
            return {
                examAttempts,
                practiceAttempts
            };
        } catch (error) {
            console.error('Error getting student results:', error);
            throw error;
        }
    }
}

module.exports = QuizAttempt;
