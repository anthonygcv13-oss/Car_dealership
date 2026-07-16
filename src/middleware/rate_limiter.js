const rateLimit = require('express-rate-limit');

// 1. Limitador general para toda la API (150 peticiones cada 15 minutos)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 150, // Límite de 150 peticiones por IP
  message: {
    success: false,
    error: 'Demasiadas solicitudes desde esta dirección IP. Por favor, intente de nuevo en 15 minutos.'
  },
  standardHeaders: 'draft-7', // Cabeceras estándar RateLimit-*
  legacyHeaders: false, // Deshabilitar cabeceras X-RateLimit-* antiguas
});

// 2. Limitador estricto para rutas de autenticación (fuerza bruta: 5 peticiones cada 15 minutos)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // Límite de 5 intentos por IP
  message: {
    success: false,
    error: 'Demasiados intentos de inicio de sesión o recuperación. Por favor, espere 15 minutos antes de volver a intentarlo.'
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// 3. Limitador intermedio para solicitudes de cotización (evitar spam: 10 cotizaciones cada 15 minutos)
const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10, // Límite de 10 cotizaciones creadas por IP
  message: {
    success: false,
    error: 'Has enviado demasiadas cotizaciones en poco tiempo. Por favor, espere unos minutos antes de solicitar otra.'
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  quoteLimiter
};
