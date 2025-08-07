const db = require('../config/database');

class Position {
    // Helper method to get user details
    static async getUserDetails(userId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, first_name, last_name, role FROM admin_users WHERE id = ?`,
                [userId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    // Get all positions with user details
    static async getAllPositionsWithUsers() {
        const connection = await db.getConnection();
        try {
            console.log('Getting all positions with users...');
            const query = `
                SELECT 
                    p.id as position_id,
                    p.user_id,
                    p.position,
                    p.responsibility_authority,
                    p.internal_external,
                    p.hierarchically_assigned_to,
                    u.first_name,
                    u.last_name,
                    u.role,
                    u.id as actual_user_id
                FROM positions p 
                LEFT JOIN admin_users u ON CAST(TRIM(LEADING '0' FROM p.user_id) AS UNSIGNED) = u.id`;
            console.log('Executing query:', query);
            const [rows] = await connection.query(query);
            console.log('Found positions:', JSON.stringify(rows, null, 2));
            return rows;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    // Helper method to detect circular references
    static isCircularReference(nodes, parentId, childId) {
        let current = nodes.get(parentId);
        const visited = new Set();

        while (current) {
            if (visited.has(current.id)) {
                return true; // Circular reference detected
            }
            if (current.id === childId) {
                return true; // Would create a circle
            }
            visited.add(current.id);
            
            // Find the parent of the current node
            current = Array.from(nodes.values()).find(node => 
                node.children.some(child => child.id === current.id)
            );
        }
        return false;
    }

    // Build organizational tree
    static async getOrganizationalTree() {
        const connection = await db.getConnection();
        try {
            const positions = await this.getAllPositionsWithUsers();
           
            if (!positions || positions.length === 0) {
                console.log('No positions found');
                return {
                    internal: [],
                    external: []
                };
            }

        
            
            // Create nodes and find potential root nodes
            const nodes = new Map();
            const hasParent = new Set();
            
            // First pass: Create all nodes and track parent relationships
            positions.forEach(pos => {
                const node = {
                    id: this.formatId(pos.user_id),
                    name: `${pos.first_name} ${pos.last_name}`,
                    position: pos.position,
                    internal_external: pos.internal_external,
                    children: []
                };
                nodes.set(this.formatId(pos.user_id), node);
                
                // Only add to hasParent if hierarchically_assigned_to is different from user_id
                if (pos.hierarchically_assigned_to && 
                    this.formatId(pos.hierarchically_assigned_to) !== this.formatId(pos.user_id)) {
                    hasParent.add(this.formatId(pos.user_id));
                }
            });
            
            // Separate internal and external positions
            const internalNodes = new Map();
            const externalPositions = [];
            
            // First separate internal and external positions
            positions.forEach(pos => {
                if (pos.internal_external === 'Internal') {
                    const node = {
                        id: this.formatId(pos.user_id),
                        name: `${pos.first_name} ${pos.last_name}`,
                        position: pos.position,
                        internal_external: pos.internal_external,
                        children: []
                    };
                    internalNodes.set(this.formatId(pos.user_id), node);
                } else {
                    // For external positions, just add them to the list without hierarchy
                    externalPositions.push({
                        id: this.formatId(pos.user_id),
                        name: `${pos.first_name} ${pos.last_name}`,
                        position: pos.position,
                        internal_external: pos.internal_external
                    });
                }
            });
            
            // Find root nodes for internal tree
            const internalRoots = [];
            
            // Process internal positions
            internalNodes.forEach((node, id) => {
                // Check if this node is assigned to itself or has no parent
                const position = positions.find(p => this.formatId(p.user_id) === id);
                if (!hasParent.has(id) || 
                    (position && this.formatId(position.hierarchically_assigned_to) === this.formatId(position.user_id))) {
                    internalRoots.push(node);
                }
            });
            
            // If no root nodes found for internal tree, use first node as root
            if (internalRoots.length === 0 && internalNodes.size > 0) {
                const firstNode = internalNodes.values().next().value;
                internalRoots.push(firstNode);
                hasParent.delete(firstNode.id);
            }

            // Build the internal tree structure
            positions.forEach(pos => {
                if (pos.internal_external === 'Internal' && 
                    pos.hierarchically_assigned_to && 
                    hasParent.has(this.formatId(pos.user_id)) &&
                    this.formatId(pos.hierarchically_assigned_to) !== this.formatId(pos.user_id)) {
                    
                    const childId = this.formatId(pos.user_id);
                    const parentId = this.formatId(pos.hierarchically_assigned_to);
                    const parentNode = internalNodes.get(parentId);
                    const childNode = internalNodes.get(childId);
                    
                    if (parentNode && childNode) {
                        // Avoid circular references
                        if (!this.isCircularReference(internalNodes, parentNode.id, childNode.id)) {
                            parentNode.children.push(childNode);
                        }
                    }
                }
            });

            return {
                internal: internalRoots,
                external: externalPositions
            };
        } catch (error) {
            throw error;
        }
    }

    // Helper method to format ID
    static formatId(id) {
        return id ? String(id).padStart(7, '0') : null;
    }

    static async create(userId, positionData) {
        const connection = await db.getConnection();
        try {
            // First, delete any existing position for this user
            await connection.query('DELETE FROM positions WHERE user_id = ?', [userId]);

            // Prepare data with defaults and null fallbacks
            const insertData = {
                user_id: Number(userId),
                position: positionData.position ? String(positionData.position) : null,
                responsibility_authority: positionData.responsibility_authority ? String(positionData.responsibility_authority) : '',
                internal_external: String((positionData.internal_external || 'internal').toLowerCase()),
                hierarchically_assigned_to: positionData.hierarchically_assigned_to ? 
                    Number(this.formatId(positionData.hierarchically_assigned_to)) : null
            };

            // Validate required fields
            if (!insertData.position) {
                throw new Error('Position is required');
            }

            // Then create the new position
            const [result] = await connection.query(
                `INSERT INTO positions (
                    user_id,
                    position,
                    responsibility_authority,
                    internal_external,
                    hierarchically_assigned_to
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    insertData.user_id,
                    insertData.position,
                    insertData.responsibility_authority,
                    insertData.internal_external,
                    insertData.hierarchically_assigned_to
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async getByUserId(userId) {
        const connection = await db.getConnection();
        try {
            const [rows] = await connection.query(
                `SELECT id, user_id, position, responsibility_authority, 
                internal_external, hierarchically_assigned_to, created_at, updated_at 
                FROM positions WHERE user_id = ? LIMIT 1`,
                [userId]
            );
            const position = rows[0];
            if (position) {
                // Format IDs
                position.user_id = this.formatId(position.user_id);
                if (position.hierarchically_assigned_to) {
                    position.hierarchically_assigned_to = this.formatId(position.hierarchically_assigned_to);
                }
                // Ensure proper casing for internal_external
                position.internal_external = position.internal_external || 'Internal';
            }
            return position || null;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async update(positionId, positionData) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.query(
                `UPDATE positions SET
                    position = ?,
                    responsibility_authority = ?,
                    internal_external = ?,
                    hierarchically_assigned_to = ?
                WHERE id = ?`,
                [
                    positionData.position,
                    positionData.responsibility_authority,
                    positionData.internal_external,
                    positionData.hierarchically_assigned_to,
                    positionId
                ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }

    static async delete(positionId) {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.query(
                'DELETE FROM positions WHERE id = ?',
                [positionId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }finally {
            connection.release();
        }
    }
}

module.exports = Position;
