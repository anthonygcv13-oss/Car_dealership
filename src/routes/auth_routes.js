const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth_controllers');

// Endpoint: POST /api/auth/login
router.post('/login', authControllers.login);

// Solicitud de recuperación
router.post('/forgot-password', authControllers.forgotPassword);

// Cambio real de contraseña
router.post('/reset-password/:token', authControllers.resetPassword);

module.exports = router;