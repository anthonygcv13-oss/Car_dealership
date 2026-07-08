const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Quote = sequelize.define('Quote', {
  id_quote: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATE },
  estimated_price: { type: DataTypes.DECIMAL(10, 2) },
  validity_date: { type: DataTypes.DATE },
  id_vehicle: { type: DataTypes.INTEGER },
  id_customer: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'quote',
  timestamps: false
});

module.exports = Quote;