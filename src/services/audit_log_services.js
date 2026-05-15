const AuditLog = require('../models/audit_log.js');

const getAllAuditLogs = async () => {
    return await AuditLog.findAll();
};

const createAuditLog = async (auditLogData) => {
    const { affected_table, affected_record_id, action, previous_data, new_data, log_date } = auditLogData;
    return await AuditLog.create({
        affected_table,
        affected_record_id,
        action,
        previous_data,
        new_data,
        log_date
    });
};

const updateAuditLog = async (id, auditLogData) => {
    const [updatedRows] = await AuditLog.update(auditLogData, {
        where: { id_audit_log: id }
    });

    if (updatedRows === 0) return null;

    return await AuditLog.findByPk(id);
};

const deleteAuditLog = async (id) => {
    const auditLogToDelete = await AuditLog.findByPk(id);
    
    if (auditLogToDelete) {
        await AuditLog.destroy({
            where: { id_audit_log: id }
        });
    }
    
    return auditLogToDelete;
};

module.exports = { getAllAuditLogs, createAuditLog, updateAuditLog, deleteAuditLog };
