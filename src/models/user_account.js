const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const UserAccount = sequelize.define('UserAccount', {
  id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name: { type: DataTypes.STRING }, // Agregamos esta
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },// Opcional: valor por defecto     
  id_role: { type: DataTypes.INTEGER }
}, {
  tableName: 'user_account',
  timestamps: false
});

module.exports = UserAccount;