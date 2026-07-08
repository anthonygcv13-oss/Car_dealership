const { DataTypes } = require('sequelize');
const app = require('./app.js');
const sequelize = require('./config/db.js');
const { startQuoteScheduler } = require('./services/quote_scheduler.js');
const { ensureDatabaseConnection } = require('./services/db_healthcheck.js');
require('dotenv').config();

async function ensureQuoteTimestampColumns() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const table = await queryInterface.describeTable('quote').catch(() => null);

    if (!table) {
      return;
    }

    if (!table.created_at) {
      await queryInterface.addColumn('quote', 'created_at', {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      });
    }

    if (!table.updated_at) {
      await queryInterface.addColumn('quote', 'updated_at', {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
      });
    }
  } catch (error) {
    console.warn('⚠️ No se pudieron asegurar las columnas de timestamp en quote:', error.message);
  }
}

const PORT = process.env.PORT || 3000;

// Sincronizar base de datos y luego arrancar
async function startServer() {
  try {
    const health = await ensureDatabaseConnection();
    if (!health.ok) {
      console.error('⚠️ No se pudo conectar a la base de datos:', health.error);
      console.error('⚠️ Revisa la URL de Neon o cambia NODE_ENV a development para usar la base local.');
      process.exit(1);
    }

    console.log('✅ Conexión con la base de datos establecida exitosamente.');
    await ensureQuoteTimestampColumns();
    await sequelize.sync();
    console.log('✅ Todos los modelos de base de datos sincronizados correctamente.');

    app.listen(PORT, () => {
      console.log('----------------------------------------------------');
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      const modo = process.env.NODE_ENV === 'production' ? 'PRODUCCIÓN (NEON)' : 'DESARROLLO (LOCAL)';
      console.log(`📡 Base de datos activa en modo: ${modo}`);
      console.log('----------------------------------------------------');
      startQuoteScheduler();
    });
  } catch (err) {
    console.error('❌ Error fatal al iniciar el servidor o conectar la base de datos:', err);
    process.exit(1);
  }
}

startServer();