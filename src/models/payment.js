const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Payment = sequelize.define('Payment', {
  id_payment: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATE },
  amount: { type: DataTypes.DECIMAL(10, 2) },
  payment_method: { type: DataTypes.STRING },
  id_user: { type: DataTypes.INTEGER },
  id_vehicle_sale: { type: DataTypes.INTEGER },
  id_installment: { type: DataTypes.INTEGER }
}, {
  tableName: 'payment',
  timestamps: false
});

module.exports = Payment;