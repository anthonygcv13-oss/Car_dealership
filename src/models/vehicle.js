const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Vehicle = sequelize.define('Vehicle', {
  id_vehicle: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  license_plate: { type: DataTypes.STRING },
  vehicle_serial: { type: DataTypes.STRING },
  engine_serial: { type: DataTypes.STRING },
  body_serial: { type: DataTypes.STRING },
  manufacture_date: { type: DataTypes.DATE },
  purchase_date: { type: DataTypes.DATE },
  mileage: { type: DataTypes.INTEGER },
  color: { type: DataTypes.STRING },
  id_model: { type: DataTypes.INTEGER },
  id_brand: { type: DataTypes.INTEGER },
  year: { type: DataTypes.INTEGER },
  purchase_price: { type: DataTypes.DECIMAL(10, 2) },
  sale_price: { type: DataTypes.DECIMAL(10, 2) },
  id_supplier: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING } // Agregado para el status
}, {
  tableName: 'vehicle',
  timestamps: false
});

module.exports = Vehicle;