const db = require('../config/database');

class QuizAttempt {
    static async create({ student_id, topic, score, total_questions, is_exam, attempt_date = new Date() }) {
        const query = `
            INSERT INTO quiz_attempts (student_id, quiz_topic, score, total_questions, is_exam, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        // Validate input parameters
        if (!student_id || !topic || score === undefined || !total_questions) {
            throw new Error('Missing required parameters for quiz attempt');
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
}

module.exports = QuizAttempt;
