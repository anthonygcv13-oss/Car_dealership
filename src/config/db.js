const { Sequelize } = require('sequelize');
require('dotenv').config({ override: true });

// Leemos DATABASE_URL de las variables de entorno. Si no existe, decidimos según el NODE_ENV
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL || (isProduction 
  ? process.env.DATABASE_URL_NEON 
  : process.env.DATABASE_URL_LOCAL);

if (!connectionString) {
  console.error("❌ Error: No se ha definido ninguna URL de base de datos en las variables de entorno.");
  process.exit(1);
}

// Adaptación automática: Si la URL no apunta a localhost o 127.0.0.1, asumimos que es una base de datos en la nube (como Neon) que requiere SSL
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
const useSSL = !isLocal;

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false, 
  dialectOptions: {
    ssl: useSSL ? {
      require: true,
      rejectUnauthorized: false 
    } : false
  }
});

module.exports = sequelize;