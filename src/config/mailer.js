const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para puerto 465, false para otros (como 587 o 2525)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verificación de conexión en la consola (desactivada en modo test)
if (process.env.NODE_ENV !== 'test') {
    transporter.verify().then(() => {
        console.log(`✅ Servidor de correo conectado (${process.env.EMAIL_HOST})`);
    }).catch((err) => {
        console.error('❌ Error al conectar con el servidor de correo:', err.message);
    });
}

module.exports = transporter;