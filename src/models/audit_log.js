const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const AuditLog = sequelize.define('AuditLog', {
  id_audit_log: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  affected_table: { type: DataTypes.STRING },
  affected_record_id: { type: DataTypes.INTEGER },
  action: { type: DataTypes.STRING },
  previous_data: { type: DataTypes.TEXT },
  new_data: { type: DataTypes.TEXT },
  log_date: { type: DataTypes.DATE }
}, {
  tableName: 'audit_log',
  timestamps: false
});

module.exports = AuditLog;