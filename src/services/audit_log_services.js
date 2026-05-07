const pool = require('../config/db.js');

const getAllAuditLogs = async () => {
  const result = await pool.query('SELECT * FROM audit_log');
  return result.rows;
};

const createAuditLog = async (auditLogData) => {
  const { affected_table, affected_record_id, action, previous_data, new_data, log_date } = auditLogData;
  const query = 'INSERT INTO audit_log (affected_table, affected_record_id, action, previous_data, new_data, log_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const result = await pool.query(query, [affected_table, affected_record_id, action, previous_data, new_data, log_date]);
  return result.rows[0];
};

const updateAuditLog = async (id, auditLogData) => {
  const { affected_table, affected_record_id, action, previous_data, new_data, log_date } = auditLogData;
  const query = 'UPDATE audit_log SET affected_table = $1, affected_record_id = $2, action = $3, previous_data = $4, new_data = $5, log_date = $6 WHERE id_audit_log = $7 RETURNING *';
  const result = await pool.query(query, [affected_table, affected_record_id, action, previous_data, new_data, log_date, id]);
  return result.rows[0];
};

const deleteAuditLog = async (id) => {
  const query = 'DELETE FROM audit_log WHERE id_audit_log = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllAuditLogs, createAuditLog, updateAuditLog, deleteAuditLog };
