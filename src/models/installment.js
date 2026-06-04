const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Installment = sequelize.define('Installment', {
  id_installment: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  number: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.DECIMAL(10, 2) },
  due_date: { type: DataTypes.DATE },
  id_vehicle_sale: { type: DataTypes.INTEGER },
  id_financing_plan: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING }
}, {
  tableName: 'installment',
  timestamps: false
});

module.exports = Installment;