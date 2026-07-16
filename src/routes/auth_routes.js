const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth_controllers');
const { authLimiter } = require('../middleware/rate_limiter.js');

// Endpoint: POST /api/auth/login
router.post('/login', authLimiter, authControllers.login);

// Solicitud de recuperación
router.post('/forgot-password', authLimiter, authControllers.forgotPassword);

// Redirigir al frontend si alguien ingresa el enlace en el navegador
router.get('/reset-password/:token', authControllers.redirectResetPassword);

// Cambio real de contraseña
router.post('/reset-password/:token', authLimiter, authControllers.resetPassword);

module.exports = router;