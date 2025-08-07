const db = require('../config/database');

class Measurement {
  static async create(data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.execute(
        'INSERT INTO measurements (measures_number, measures_title, months, according_to_paragraph, show_in_documents) VALUES (?, ?, ?, ?, ?)',
        [data.measures_number, data.measures_title, data.months, data.according_to_paragraph, data.show_in_documents]
      );
      
      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error creating measurement: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async findAll() {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM measurements WHERE deleted_at IS NULL ORDER BY measures_number');
      return rows;
    } catch (error) {
      throw new Error('Error fetching measurements: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM measurements WHERE id = ? AND deleted_at IS NULL', [id]);
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching measurement: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async findByMeasureNumber(measureNumber) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM measurements WHERE measures_number = ? AND deleted_at IS NULL', [measureNumber]);
      return rows[0];
    } catch (error) {
      throw new Error('Error fetching measurement by number: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM measurements WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.execute(
        'UPDATE measurements SET measures_number = ?, measures_title = ?, months = ?, according_to_paragraph = ?, show_in_documents = ? WHERE id = ?',
        [data.measures_number, data.measures_title, data.months, data.according_to_paragraph, data.show_in_documents, id]
      );
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error updating measurement: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Soft delete the measurement
      const [result] = await connection.execute(
        'UPDATE measurements SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error deleting measurement: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async toggleShowInDocuments(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.execute(
        'UPDATE measurements SET show_in_documents = NOT show_in_documents WHERE id = ?',
        [id]
      );
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Measurement;
