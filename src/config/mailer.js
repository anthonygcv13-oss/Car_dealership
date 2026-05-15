const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // Importante: Mailtrap usa false para el puerto 2525
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verificación de conexión en la consola
transporter.verify().then(() => {
    console.log('✅ Mailtrap conectado: Las pruebas aparecerán en tu bandeja virtual');
}).catch((err) => {
    console.error('❌ Error al conectar con Mailtrap:', err);
});

module.exports = transporter;