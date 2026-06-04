const notificationServices = require('../services/notification_services.js');

const getNotifications = async (req, res) => {
  try {
    const data = await notificationServices.getAllNotifications();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const updated = await notificationServices.markAsRead(req.params.id);
    if (!updated) return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await notificationServices.markAllAsRead();
    res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const deleted = await notificationServices.deleteNotification(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    res.json({ success: true, message: 'Notificación eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
};
