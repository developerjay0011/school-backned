const db = require('../config/database');
const StudentInvoice = require('./studentInvoiceModel');

const FILE_CATEGORIES = {
  FEEDBACK_FORM: 'course_feedback',
  certificate_of_absence: 'certificate_of_absence',
  INVOICE: 'invoice',
  RESULT_SHEET: 'result_sheet',
  TRAINING_REPORT: 'training_report'
};

class StudentFile {
  static async getAllDocuments(studentId) {
    const connection = await db.getConnection();
    try {
      // Get all documents from different sources
      const [feedbackForms] = await connection.execute(
        `SELECT 
          'course_feedback' as category,
          fe.id as id,
          CONCAT('Course Feedback: ', DATE_FORMAT(fe.date_from, '%Y-%m-%d'), ' to ', DATE_FORMAT(fe.date_until, '%Y-%m-%d')) as description,
          CONCAT('/uploads/', fe.pdf_url) as file_path,
          fe.created_at as created_at,
          'System' as created_by
        FROM feedback_evaluations fe
        INNER JOIN measurements m ON fe.measures_id = m.id
        INNER JOIN student s ON s.measures = m.measures_title
        WHERE s.student_id = ?`,
        [studentId]
      );

      // TODO: Update this to use certificate_of_absence table once available
      const [absenceCertificates] = await connection.execute(
        `SELECT 
          sl.*
        FROM certificate_of_absence sl
        WHERE sl.student_id = ?`,
        [studentId]
      );

      const invoices = await StudentInvoice.getByStudentId(studentId);

      const [resultSheets] = await connection.execute(
        `SELECT 
          'result_sheet' as category,
          rsp.*
        FROM result_sheet_pdf rsp
        WHERE rsp.student_id = ?`,
        [studentId]
      );

      // Training reports are stored in student_files with specific type
      const [trainingReports] = await connection.execute(
        `SELECT 
          'training_report' as category,
          sf.id as id,
          sf.description,
          CONCAT('/uploads/', sf.file_path) as file_path,
          sf.created_at as created_at,
          CONCAT(au.first_name, ' ', au.last_name) as created_by
        FROM student_files sf
        LEFT JOIN admin_users au ON sf.uploaded_by = au.id
        WHERE sf.student_id = ? AND sf.file_type = '.pdf' AND sf.description LIKE '%training%' AND sf.deleted_at IS NULL`,
        [studentId]
      );

      // Get additional uploaded files
      const [uploadedFiles] = await connection.execute(
        `SELECT 
          file_type as category,
          sf.id as id,
          description,
          CONCAT('/uploads/', sf.file_path) as file_path,
          sf.created_at as created_at,
          CONCAT(l.first_name, ' ', l.last_name) as created_by
        FROM student_files sf
        LEFT JOIN admin_users l ON sf.uploaded_by = l.id
        WHERE sf.student_id = ? AND sf.deleted_at IS NULL`,
        [studentId]
      );

      // Organize documents by category and ensure each category is an array
      // Get student reports
      const [reports] = await connection.execute(
        `SELECT 
         sr.*,
          CONCAT('/uploads/', COALESCE(sr.pdf_url, '')) as file_path
        FROM student_reports sr
        WHERE sr.student_id = ?`,
        [studentId]
      );

      const documents = {
        feedback_forms: feedbackForms || [],
        certificate_of_absences: absenceCertificates || [],
        invoices: invoices.map(invoice => ({
          ...invoice,
          xml_url: invoice.xml_url ? process.env.BACKEND_URL + invoice.xml_url : null,
          pdf_url: invoice.pdf_url ? process.env.BACKEND_URL + invoice.pdf_url : null
      }))|| [],
        result_sheets: resultSheets || [],
        training_reports: trainingReports || [],
        student_reports: reports || [],
        other_files: uploadedFiles || []
      };

      return documents;
    } catch (error) {
      throw new Error('Error fetching student documents: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      console.log('Creating student file with data:', data);
      const [result] = await connection.execute(
        'INSERT INTO student_files (student_id, file_name, file_path, file_type, description, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [data.student_id, data.file_name, data.file_path, data.file_type, data.description || null, data.uploaded_by]
      );
      
      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error creating student file: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async findByStudentId(studentId) {
    const connection = await db.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
          sf.id,
          sf.student_id,
          sf.file_name,
          CONCAT('/uploads/', sf.file_path) as file_path,
          sf.file_type,
          sf.description,
          sf.created_at,
          CONCAT(u.first_name, ' ', u.last_name) as uploader_name
        FROM student_files sf
        LEFT JOIN admin_users u ON sf.uploaded_by = u.id
        WHERE sf.student_id = ? AND sf.deleted_at IS NULL
        ORDER BY sf.created_at DESC`,
        [studentId]
      );
      return rows;
    } catch (error) {
      throw new Error('Error fetching student files: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.execute(
        'UPDATE student_files SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [id]
      );
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw new Error('Error deleting student file: ' + error.message);
    } finally {
      connection.release();
    }
  }
}

module.exports = StudentFile;
