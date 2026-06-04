const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Brand = sequelize.define('Brand', {
  id_brand: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  country_origin: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING }
}, {
  tableName: 'brand',
  timestamps: false
});

module.exports = Brand;