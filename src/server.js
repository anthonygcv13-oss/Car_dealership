const app = require('./app.js');
const sequelize = require('./config/db.js');
require('./models/associations.js');
require('dotenv').config();

const PORT = process.env.PORT || 10000;

// Sincronizar base de datos y luego arrancar
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión con la base de datos establecida exitosamente.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Todos los modelos de base de datos sincronizados correctamente.');
    app.listen(PORT, () => {
        console.log('----------------------------------------------------');
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        const modo = process.env.NODE_ENV === 'production' ? 'PRODUCCIÓN (NEON)' : 'DESARROLLO (LOCAL)';
        console.log(`📡 Base de datos activa en modo: ${modo}`);
        console.log('----------------------------------------------------');
    });
  })
  .catch((err) => {
    console.error('❌ Error fatal al iniciar el servidor o conectar la base de datos:', err);
    process.exit(1);
  });