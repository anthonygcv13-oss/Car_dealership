const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determinamos qué URL usar
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction 
  ? process.env.DATABASE_URL_NEON 
  : process.env.DATABASE_URL_LOCAL;

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false, 
  dialectOptions: {
    ssl: isProduction ? {
      require: true,
      rejectUnauthorized: false 
    } : false
  }
});

module.exports = sequelize;