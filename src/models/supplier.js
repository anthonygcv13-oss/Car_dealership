const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Supplier = sequelize.define('Supplier', {
  id_supplier: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  tax_id: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  alternate_phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  alternate_email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  payment_terms: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING }
}, {
  tableName: 'supplier',
  timestamps: false
});

module.exports = Supplier;