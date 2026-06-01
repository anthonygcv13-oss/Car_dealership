const app = require('./app.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Arranque
app.listen(PORT, () => {
    console.log('----------------------------------------------------');
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    const modo = process.env.NODE_ENV === 'production' ? 'PRODUCCIÓN (NEON)' : 'DESARROLLO (LOCAL)';
    console.log(`📡 Base de datos activa en modo: ${modo}`);
    console.log('----------------------------------------------------');
});