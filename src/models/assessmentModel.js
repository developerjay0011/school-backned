const db = require('../config/database');
const crypto = require('crypto');
const DateTimeUtils = require('../utils/dateTimeUtils');

class Assessment {
    static async generateLink() {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Generate a random token
            const token = crypto.randomBytes(32).toString('hex');
            
            // Calculate expiry date (7 days from now)
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);

            const [result] = await connection.execute(
                `INSERT INTO assessment_links (token, expiry_date)
                 VALUES (?, ?)`,
                [token, expiryDate]
            );

            await connection.commit();
            return {
                id: result.insertId,
                token,
                expiryDate
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async validateToken(token) {
     let connection;
        try {
            connection = await db.getConnection();
            const [links] = await connection.execute(
                `SELECT * FROM assessment_links 
                 WHERE token = ? AND expiry_date > ? AND is_completed = FALSE`,
                [token,DateTimeUtils.getBerlinDateTime().toFormat('yyyy-MM-dd HH:mm:ss')]
            );
            return links[0];
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async getQuestions() {
     let connection;
        try {
            connection = await db.getConnection();
            // Get all questions
            const [questions] = await connection.execute(
                'SELECT * FROM assessment_questions ORDER BY task_number, id'
            );

            // Get options for all questions
            const questionIds = questions.map(q => q.id);
            let options = [];
            if (questionIds.length > 0) {
                const placeholders = questionIds.map(() => '?').join(',');
                [options] = await connection.execute(
                    `SELECT * FROM assessment_options WHERE question_id IN (${placeholders})`,
                    questionIds
                );
            }

            // Organize questions by task
            const taskQuestions = questions.reduce((acc, question) => {
                if (!acc[question.task_number]) {
                    acc[question.task_number] = [];
                }
                
                // Add options to question
                question.options = options.filter(opt => opt.question_id === question.id)
                    .map(opt => ({
                        id: opt.id,
                        text: opt.option_text
                    }));
                
                acc[question.task_number].push(question);
                return acc;
            }, {});

            return taskQuestions;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async submitResponses(assessmentLinkId, firstName, lastName, signatureImage, responses) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // Update first_name, last_name and signature
            await connection.execute(
                'UPDATE assessment_links SET first_name = ?, last_name = ?, signature_image = ? WHERE id = ?',
                [firstName, lastName, signatureImage, assessmentLinkId]
            );

            // Insert each response
            for (const response of responses) {
                await connection.execute(
                    `INSERT INTO assessment_responses 
                     (assessment_link_id, question_id, selected_option_id)
                     VALUES (?, ?, ?)`,
                    [assessmentLinkId, response.questionId, response.selectedOptionId]
                );
            }

            // Mark assessment as completed
            await connection.execute(
                'UPDATE assessment_links SET is_completed = TRUE WHERE id = ?',
                [assessmentLinkId]
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async getResults(assessmentLinkId) {
     let connection;
        try {
            connection = await db.getConnection();
            // Get user information
            const [userInfo] = await connection.execute(
                'SELECT first_name, last_name, signature_image, comment FROM assessment_links WHERE id = ?',
                [assessmentLinkId]
            );

            if (!userInfo.length) {
                return null;
            }

            // Get responses with question text and all options
            const [responses] = await connection.execute(
                `SELECT 
                    ar.question_id,
                    ar.selected_option_id,
                    aq.question_text,
                    aq.task_number,
                    GROUP_CONCAT(ao.id) as option_ids,
                    GROUP_CONCAT(ao.option_text) as option_texts,
                    GROUP_CONCAT(ao.is_correct) as is_correct_list
                FROM assessment_responses ar
                JOIN assessment_questions aq ON ar.question_id = aq.id
                JOIN assessment_options ao ON ao.question_id = aq.id
                WHERE ar.assessment_link_id = ?
                GROUP BY ar.question_id
                ORDER BY aq.task_number, ar.question_id`,
                [assessmentLinkId]
            );

            // Format responses with options
            const formattedResponses = responses.map(response => {
                const optionIds = response.option_ids.split(',');
                const optionTexts = response.option_texts.split(',');
                const isCorrectList = response.is_correct_list.split(',').map(val => val === '1');

                // Create option map (a, b, c)
                const options = {};
                const letters = ['a', 'b', 'c'];
                optionIds.forEach((id, index) => {
                    const letter = letters[index];
                    options[`option_${letter}`] = optionTexts[index];
                    if (id === response.selected_option_id.toString()) {
                        options.selected_option = letter;
                    }
                    if (isCorrectList[index]) {
                        options.correct_option = letter;
                    }
                });

                return {
                    question: response.question_text,
                    ...options
                };
            });

            const totalQuestions = responses.length;
            const correctAnswers = formattedResponses.filter(r => r.selected_option === r.correct_option).length;

            return {
                first_name: userInfo[0].first_name,
                last_name: userInfo[0].last_name,
                signature_image: userInfo[0].signature_image,
                comment: userInfo[0].comment,
                responses: formattedResponses,
                totalQuestions,
                correctAnswers,
                score: (correctAnswers / totalQuestions) * 100
            };
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async getAllAssessments() {
     let connection;
        try {
            connection = await db.getConnection();
            const [assessments] = await connection.execute(
                `SELECT 
                    al.*,
                    (SELECT COUNT(*) FROM assessment_responses ar WHERE ar.assessment_link_id = al.id) as total_responses,
                    (SELECT COUNT(*) FROM assessment_responses ar 
                     JOIN assessment_options ao ON ar.selected_option_id = ao.id 
                     WHERE ar.assessment_link_id = al.id AND ao.is_correct = true) as correct_responses,
                    (SELECT pdf_url FROM assessment_responses ar WHERE ar.assessment_link_id = al.id LIMIT 1) as pdf_url
                FROM assessment_links al
                ORDER BY al.created_at DESC`
            );
            // Calculate scores and format dates
            return assessments.map(assessment => ({
                id: assessment.id,
                token: assessment.token,
                first_name: assessment.first_name,
                last_name: assessment.last_name,
                assessment_url: `${process.env.FRONTEND_URL}/assessment-suitability-form?token=${assessment.token}`,
                expiry_date: assessment.expiry_date,
                updated_at: assessment.updated_at,
                comment: assessment.comment,
                pdf_url: assessment.pdf_url ? `${process.env.BACKEND_URL}${assessment.pdf_url}` : null,
                is_completed: Boolean(assessment.is_completed),
                created_at: assessment.created_at,
                score: assessment.total_responses ? 
                    Math.round((assessment.correct_responses / assessment.total_responses) * 100) : 
                    null,
                total_questions: assessment.total_responses,
                correct_answers: assessment.correct_responses
            }));
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async addComment(assessmentLinkId, comment) {
     let connection;
        try {
            connection = await db.getConnection();
            // First check if the assessment exists
            const [assessments] = await connection.execute(
                'SELECT id FROM assessment_links WHERE id = ?',
                [assessmentLinkId]
            );

            if (assessments.length === 0) {
                return null;
            }

            // Update the comment
            await connection.execute(
                'UPDATE assessment_links SET comment = ? WHERE id = ?',
                [comment, assessmentLinkId]
            );

            // Get the updated assessment
            const [updatedAssessments] = await connection.execute(
                'SELECT * FROM assessment_links WHERE id = ?',
                [assessmentLinkId]
            );

            return updatedAssessments[0];
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async deleteAssessment(assessmentLinkId) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // First delete all responses for this assessment
            await connection.execute(
                'DELETE FROM assessment_responses WHERE assessment_link_id = ?',
                [assessmentLinkId]
            );

            // Then delete the assessment link itself
            const [result] = await connection.execute(
                'DELETE FROM assessment_links WHERE id = ?',
                [assessmentLinkId]
            );

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }

    static async updatePdfUrl(assessmentId, pdfUrl) {
     let connection;
        try {
            connection = await db.getConnection();
            await connection.execute(
                'UPDATE assessment_responses SET pdf_url = ? WHERE assessment_link_id = ?',
                [pdfUrl, assessmentId]
            );
        } finally {
            if (connection) {
                try {
                    connection.release();
                    console.log('Connection released in User.delete');
                } catch (releaseError) {
                    console.error('Error releasing connection in User.delete:', releaseError);
                }
            }
        }
    }
}

module.exports = Assessment;
