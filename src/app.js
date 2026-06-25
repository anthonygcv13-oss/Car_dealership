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
app.use(morgan('dev'));
app.use(express.json()); // Crucial: Permite que el servidor entienda los datos que envías (el Body)
app.use(express.urlencoded({ extended: true })); // Opcional pero recomendado para formularios

// Conectamos el hub de rutas bajo el prefijo /api
app.use('/api', routes);

// Ruta base para confirmar que el servidor vive
app.get('/', (req, res) => {
    res.json({ message: "API Concesionario Car Dealership funcionando" });
});

// Manejo de 404
app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

module.exports = app;
