const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Customer = sequelize.define('Customer', {
  id_customer: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING },
  last_name: { type: DataTypes.STRING },
  document: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING }
}, {
  tableName: 'customer',
  timestamps: false
});

module.exports = Customer;