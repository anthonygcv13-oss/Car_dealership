const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth_controllers');

// Endpoint: POST /api/auth/login
router.post('/login', authControllers.login);

// Solicitud de recuperación
router.post('/forgot-password', authControllers.forgotPassword);

// Redirigir al frontend si alguien ingresa el enlace en el navegador
router.get('/reset-password/:token', authControllers.redirectResetPassword);

// Cambio real de contraseña
router.post('/reset-password/:token', authControllers.resetPassword);

module.exports = router;