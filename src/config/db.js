const { Pool } = require('pg');
require('dotenv').config();

// Definimos cuál base de datos usar (puedes cambiar 'local' por 'neon' manualmente)
// En lugar de: const ambiente = 'local';
const ambiente = process.env.NODE_ENV === 'production' ? 'neon' : 'local';

let config;

if (ambiente === 'neon') {
    // Configuración para Neon usando la URL completa
    config = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Requerido para conexiones seguras en Neon
        }
    };
} else {
    // Tu configuración local que ya tenías
    config = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };
}

const pool = new Pool(config);

pool.on('connect', () => {
    console.log(`Conectado a PostgreSQL (${ambiente})`);
});

pool.on('error', (err) => {
    console.error('Error inesperado en el pool:', err);
});

module.exports = pool;