const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/audit_log_controllers.js');
const authorize = require('../middleware/auth_middleware.js');
// src/routes/audit_log_routes.js
router.get('/', authorize([1, 5]), auditLogController.getAuditLogs);
// Las auditorías no se borran ni se editan manualmente por seguridad, 
// pero si tuvieras que hacerlo, solo el Admin:
router.delete('/:id', authorize([1]), auditLogController.deleteAuditLog);

module.exports = router;
