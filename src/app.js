const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importar asociaciones para registrar modelos y relaciones en Sequelize
require('./models/associations.js');

// Importamos el hub central de rutas
const routes = require('./routes.js'); 

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());

// Configurar morgan para omitir logs de HMR y favicon para mantener limpia la consola
app.use(morgan('dev', {
    skip: (req, res) => req.originalUrl.startsWith('/_next') || req.originalUrl === '/favicon.ico'
}));

app.use(express.json()); // Crucial: Permite que el servidor entienda los datos que envías (el Body)
app.use(express.urlencoded({ extended: true })); // Opcional pero recomendado para formularios

// Conectamos el hub de rutas bajo el prefijo /api
app.use('/api', routes);

// Ruta base para confirmar que el servidor vive
app.get('/', (req, res) => {
    res.json({ message: "API Concesionario Car Dealership funcionando" });
});

// Silenciar peticiones de favicon.ico y Next.js HMR para evitar logs y errores innecesarios
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/_next', (req, res) => res.status(404).end());

// Manejo de 404
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

// Middleware de manejo de errores global para diagnosticar fallos en desarrollo
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR STACK TRACE:", err);
    res.status(500).json({ success: false, error: err.message, stack: err.stack });
});

module.exports = app;
