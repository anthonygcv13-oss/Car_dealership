const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Model = sequelize.define('Model', {
  id_model: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  id_brand: { type: DataTypes.INTEGER },
  fuel_type: { type: DataTypes.STRING },
  transmission: { type: DataTypes.STRING },
  body_type: { type: DataTypes.STRING }
}, {
  tableName: 'model',
  timestamps: false
});

module.exports = Model;