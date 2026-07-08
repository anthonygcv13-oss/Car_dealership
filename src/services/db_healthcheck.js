const sequelize = require('../config/db.js');

async function ensureDatabaseConnection() {
  try {
    await sequelize.authenticate();
    return { ok: true, connectionString: sequelize.connectionManager.config.connectionString };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

module.exports = { ensureDatabaseConnection };