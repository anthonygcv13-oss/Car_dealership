const { Pool } = require('pg');
require('dotenv').config();

// Creamos un Pool (es más eficiente que una conexión única)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Prueba de conexión
pool.on('connect', () => {
    console.log('Conectado a la base de datos PostgreSQL');
});

module.exports = pool;