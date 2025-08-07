const User = require('../../models/userModel');
const Position = require('../../models/positionModel');
const Training = require('../../models/trainingModel');
const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
    static async changePassword(req, res) {
        const connection = await db.getConnection();
        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            if (!newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'New password is required'
                });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the password in the database
            const [result] = await connection.execute(
                'UPDATE admin_users SET password = ? WHERE id = ?',
                [hashedPassword, id.padStart(6, '0')] // Ensure ID is padded to match ZEROFILL
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            return res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Error changing password:', error);
            return res.status(500).json({
                success: false,
                message: 'Error changing password',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }
    static async register(req, res) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Extract and validate required fields
            const userData = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: req.body.password || Math.random().toString(36).slice(-8),
                email: req.body.email || null,
                phone_number: req.body.phone_number || null,
                street: req.body.street || null,
                pincode: req.body.pincode || null,
                city: req.body.city || null,
                country: req.body.country || null,
                role: req.body.role || 'admin',
                status: req.body.status || 'Active'
            };

            // Check if position is provided in nested or flat format
            const positionValue = typeof req.body.position === 'object' ? 
                req.body.position.position : req.body.position;

            // Validate required fields
            if (!userData.first_name || !userData.last_name || !positionValue) {
                return res.status(400).json({
                    success: false,
                    message: 'First name, last name, and position are required'
                });
            }

            // Create user with provided data
            const userId = await User.createMinimal(userData);

            // Handle both nested and flat position data
            const positionData = {
                position: positionValue,
                responsibility_authority: (req.body.position?.responsibility_authority || req.body.responsibility_authority || ''),
                internal_external: (req.body.position?.internal_external || req.body.internal_external || 'Internal'),
                hierarchically_assigned_to: (req.body.position?.hierarchically_assigned_to || req.body.hierarchically_assigned_to || '').trim() || null
            };

            // Format hierarchically_assigned_to if it exists
            if (positionData.hierarchically_assigned_to) {
                positionData.hierarchically_assigned_to = positionData.hierarchically_assigned_to.padStart(7, '0');
            }
            await Position.create(userId, positionData);

            await connection.commit();

            // Get the created user and position
            const user = await User.getById(userId);
            const position = await Position.getByUserId(userId);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    ...user,
                    positions: position
                }
            });
        } catch (error) {
            await connection.rollback();
            console.error('Error registering user:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error registering user',
                error: error.message
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            if (user.status !== 'Active') {
                return res.status(403).json({
                    success: false,
                    message: 'Account is inactive'
                });
            }

            const token = jwt.sign(
                { 
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user.id,

                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        role: user.role,
                        status: user.status,
                        address: {
                            street: user.street,
                            city: user.city,
                            state: user.state,
                            zip: user.zip
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login',
                error: error.message
            });
        }
    }

    static async getAll(req, res) {
        const connection = await db.getConnection();
        try {
            const users = await User.getAll();
            const usersWithPositions = [];

            // Get positions for each user
            for (const user of users) {
                const position = await Position.getByUserId(user.id);
                usersWithPositions.push({
                    ...user,
                    position: position || null
                });
            }

            res.json({
                success: true,
                data: usersWithPositions
            });
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting users',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }

    static async getOne(req, res) {
        const connection = await db.getConnection();
        try {
            const { id } = req.params;
            const user = await User.getById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Get user's position
            const position = await Position.getByUserId(id);

            res.json({
                success: true,
                data: {
                    ...user,
                    position: position || null
                }
            });
        } catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({
                success: false,
                message: 'Error retrieving user',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }

    static async update(req, res) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const userId = req.params.id;
            const { position, training, ...userData } = req.body;

            // Update user data
            const success = await User.update(userId, userData);
            if (!success) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Handle position data if provided
            if (position) {
                if (position.id) {
                    // Update existing position
                    await Position.update(position.id, position);
                } else {
                    // Create new position (this will replace any existing position)
                    await Position.create(userId, position);
                }
            }

            // Handle training data if provided
            if (training) {
                if (training.id) {
                    // Update existing training
                    await Training.update(training.id, training);
                } else {
                    // Create new training
                    await Training.create(userId, training);
                }
            }

            await connection.commit();

            // Get updated user data with positions and trainings
            const userPositions = await Position.getByUserId(userId);
            const userTrainings = await Training.getByUserId(userId);
            const updatedUser = await User.getById(userId);

            res.json({
                success: true,
                message: 'User updated successfully',
                data: {
                    user: updatedUser,
                    positions: userPositions,
                    trainings: userTrainings
                }
            });
        } catch (error) {
            await connection.rollback();
            console.error('Error updating user:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }

    static async delete(req, res) {
        const connection = await db.getConnection();
        try {
            const success = await User.delete(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting user',
                error: error.message
            });
        } finally {
            connection.release();
        }
    }
}

module.exports = UserController;
