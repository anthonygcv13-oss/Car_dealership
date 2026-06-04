const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Notification = sequelize.define('Notification', {
  id_notification: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'info' }, // success, warning, info
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'notification',
  timestamps: false
});

module.exports = Notification;
