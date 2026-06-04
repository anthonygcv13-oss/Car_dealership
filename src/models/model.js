const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Model = sequelize.define('Model', {
  id_model: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  id_brand: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING },
  launch_year: { type: DataTypes.INTEGER },
  discontinuation_year: { type: DataTypes.INTEGER },
  fuel_type: { type: DataTypes.STRING },
  engine_displacement: { type: DataTypes.DECIMAL(5, 2) },
  transmission: { type: DataTypes.STRING },
  number_doors: { type: DataTypes.INTEGER },
  passenger_capacity: { type: DataTypes.INTEGER },
  body_type: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING }
}, {
  tableName: 'model',
  timestamps: false
});

module.exports = Model;