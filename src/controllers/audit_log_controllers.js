const auditLogService = require('../services/audit_log_services.js');

const getAuditLogs = async (req, res) => {
  try {
    const data = await auditLogService.getAllAuditLogs();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createAuditLog = async (req, res) => {
  try {
    const newItem = await auditLogService.createAuditLog(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateAuditLog = async (req, res) => {
  try {
    const updated = await auditLogService.updateAuditLog(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'audit log no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteAuditLog = async (req, res) => {
  try {
    const deleted = await auditLogService.deleteAuditLog(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'audit log no encontrado' });
    res.json({ success: true, message: 'audit log eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAuditLogs, createAuditLog, updateAuditLog, deleteAuditLog };
