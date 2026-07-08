const { Sequelize } = require('sequelize');
require('dotenv').config();

const resolveDatabaseConnectionString = () => {
  const localUrl = process.env.DATABASE_URL_LOCAL;
  const neonUrl = process.env.DATABASE_URL_NEON;
  const useLocal = process.env.USE_LOCAL_DB === 'true' || process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV === 'true';

  if (useLocal && localUrl) {
    return localUrl;
  }

  return neonUrl || localUrl;
};

const connectionString = resolveDatabaseConnectionString();
const useNeonDb = process.env.NODE_ENV === 'production' && process.env.USE_LOCAL_DB !== 'true' && process.env.LOCAL_DEV !== 'true';

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: useNeonDb ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 1000
  }
});

module.exports = sequelize;
module.exports.resolveDatabaseConnectionString = resolveDatabaseConnectionString;