const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const VehicleSale = sequelize.define('VehicleSale', {
  id_vehicle_sale: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  date: { type: DataTypes.DATE },
  final_price: { type: DataTypes.DECIMAL(10, 2) },
  sale_type: { type: DataTypes.STRING },
  id_user: { type: DataTypes.INTEGER },
  id_customer: { type: DataTypes.INTEGER },
  id_vehicle: { type: DataTypes.INTEGER },
  id_financing_plan: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING }
}, {
  tableName: 'vehicle_sale',
  timestamps: false
});

module.exports = VehicleSale;