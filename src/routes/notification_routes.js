const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

// Rutas protegidas de notificaciones - cualquier usuario autenticado puede acceder a ellas
router.get('/', authorize(), notificationController.getNotifications);
router.put('/read-all', authorize(), notificationController.markAllNotificationsRead);
router.put('/:id/read', authorize(), notificationController.markNotificationRead);
router.delete('/:id', authorize(), notificationController.deleteNotification);

module.exports = router;
