const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Role = sequelize.define('Role', {
  id_role: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING }
}, {
  tableName: 'role',
  timestamps: false
});

module.exports = Role;