const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AdminModel = require('../../models/adminModel');
const LecturerModel = require('../../models/lecturerModel');

class AdminAuthController {
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email/username and password are required'
                });
            }

            // First try admin login (using email)
            const admin = await AdminModel.getByEmail(username);
            if (admin && admin.password) {
                const isPasswordValid = await bcrypt.compare(password, admin.password);
                if (isPasswordValid) {
                    const token = jwt.sign(
                        { 
                            id: admin.id || 0, 
                            role: 'admin',
                            email: admin.email || '',
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    return res.json({
                        success: true,
                        message: 'Admin login successful',
                        data: {
                            token,
                            user: {
                                id: admin.id || 0,
                                email: admin.email || '',
                                role: 'admin',
                                username: admin.username || '',
                                firstName: admin.first_name || '',
                                lastName: admin.last_name || '',
                                status: admin.status || '',
                            }
                        }
                    });
                }
            }

            // If admin login fails, try lecturer login
            console.log('Attempting lecturer login with username:', username);
            const lecturer = await LecturerModel.getByLecturerId(username);
            console.log('Found lecturer:', lecturer);
            if (lecturer && lecturer.password) {
                // Compare hashed password
                const isPasswordValid = await bcrypt.compare(password, lecturer.password);
                if (isPasswordValid) {
                    // Ensure lecturer_id is properly formatted
                    const lecturerId = String(lecturer.lecturer_id).padStart(7, '0');
                    console.log('Lecturer ID for token:', lecturerId);

                    const tokenPayload = { 
                        id: lecturer.id || 0,
                        lecturer_id: lecturerId,
                        role: 'lecturer',
                        firstName: lecturer.first_name || '',
                        lastName: lecturer.last_name || ''
                    };

                    console.log('Token payload:', tokenPayload);
                    
                    const token = jwt.sign(
                        tokenPayload,
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    return res.json({
                        success: true,
                        message: 'Lecturer login successful',
                        data: {
                            token,
                            user: {
                                id: lecturer.id || 0,
                                lecturer_id: String(lecturer.lecturer_id).padStart(7, '0'),
                                firstName: lecturer.first_name || '',
                                lastName: lecturer.last_name || '',
                                role: 'lecturer'
                            }
                        }
                    });
                }
            }

            // If both fail, return error
            res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = AdminAuthController;
