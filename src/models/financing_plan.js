const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const FinancingPlan = sequelize.define('FinancingPlan', {
  id_financing_plan: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  interest_rate: { type: DataTypes.DECIMAL(5, 2) },
  number_installments: { type: DataTypes.INTEGER }
}, {
  tableName: 'financing_plan',
  timestamps: false
});

module.exports = FinancingPlan;