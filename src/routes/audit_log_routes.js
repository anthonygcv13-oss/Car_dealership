const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/audit_log_controllers.js');

router.get('/', auditLogController.getAuditLogs);
router.post('/', auditLogController.createAuditLog);
router.put('/:id', auditLogController.updateAuditLog);
router.delete('/:id', auditLogController.deleteAuditLog);

module.exports = router;
