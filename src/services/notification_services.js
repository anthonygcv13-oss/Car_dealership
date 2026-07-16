const Notification = require('../models/notification.js');
const { getIO } = require('../config/socket.js');

const getAllNotifications = async () => {
  return await Notification.findAll({
    order: [['id_notification', 'DESC']]
  });
};

const createNotification = async (title, message, type = 'info') => {
  const notification = await Notification.create({
    title,
    message,
    type,
    timestamp: new Date(),
    read: false
  });

  try {
    const io = getIO();
    io.emit('notification:created', notification);
    console.log('📡 Notificación emitida vía WebSocket:', notification.id_notification);
  } catch (err) {
    console.warn('⚠️ No se pudo emitir la notificación vía socket:', err.message);
  }

  return notification;
};

const markAsRead = async (id) => {
  const [updatedRows] = await Notification.update(
    { read: true },
    { where: { id_notification: id } }
  );

  if (updatedRows === 0) return null;
  return await Notification.findByPk(id);
};

const markAllAsRead = async () => {
  await Notification.update(
    { read: true },
    { where: { read: false } }
  );
  return { success: true };
};

const deleteNotification = async (id) => {
  const notificationToDelete = await Notification.findByPk(id);

  if (notificationToDelete) {
    await Notification.destroy({
      where: { id_notification: id }
    });
  }

  return notificationToDelete;
};

module.exports = {
  getAllNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
