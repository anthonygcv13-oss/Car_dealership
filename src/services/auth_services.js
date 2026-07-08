const { UserAccount } = require('../models/associations.js'); //
const bcrypt = require('bcrypt'); //
const jwt = require('jsonwebtoken'); //
const transporter = require('../config/mailer.js');
const fs = require('fs');
const path = require('path');

const login = async (email, password) => {
    // Buscamos al usuario por su correo
    const user = await UserAccount.findOne({
        where: { email }
    });

    if (!user) {
        throw new Error('Correo electrónico no encontrado');
    }

    // Verificamos la contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Contraseña incorrecta');
    }

    // Verificamos que la cuenta no esté desactivada
    if (user.status !== 'active') {
        throw new Error('Esta cuenta está desactivada. Por favor, contacta al administrador.');
    }

    // --- GENERACIÓN DEL TOKEN ---
    // Guardamos el id y el ROL dentro del token para que el middleware lo use después
    const token = jwt.sign(
        { id: user.id_user, role: user.id_role }, 
        process.env.JWT_SECRET || 'secret_key_temporal', 
        { expiresIn: '8h' }
    );

    // Quitamos la contraseña antes de devolver el objeto del usuario
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    // IMPORTANTE: Devolvemos el usuario y el TOKEN
    return { user: userWithoutPassword, token };
};



// --- NUEVA FUNCIÓN: SOLICITAR RECUPERACIÓN ---
const sendResetPasswordEmail = async (email) => {
    // 1. Buscar si el usuario existe en la base de datos
    const user = await UserAccount.findOne({ where: { email } });
    if (!user) {
        throw new Error('No existe una cuenta asociada a este correo electrónico.');
    }

    // 2. Generar un token temporal que solo sirva para cambiar la clave (expira en 15 min)
    const resetToken = jwt.sign(
        { id: user.id_user }, 
        process.env.JWT_SECRET, 
        { expiresIn: '15m' }
    );

    // 3. Crear el enlace que se enviará al usuario (apunta al frontend)
    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3001';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // 4. Leer la plantilla HTML y reemplazar placeholders
    // Intentamos buscar la plantilla en la ruta especificada en .env o en el panel administrativo vecino
    let templatePath = process.env.EMAIL_TEMPLATE_PATH;
    if (templatePath) {
        // Resolver relativo al directorio raíz del proceso o ruta absoluta
        templatePath = path.resolve(process.cwd(), templatePath);
    }
    
    // Si no está configurada la variable o no existe el archivo, buscamos por defecto en el panel administrativo vecino
    if (!templatePath || !fs.existsSync(templatePath)) {
        const neighborPath = path.resolve(process.cwd(), '../Panel-administrativo-Car_dealers/templates/email-reset-password.html');
        if (fs.existsSync(neighborPath)) {
            templatePath = neighborPath;
        } else {
            // Fallback seguro a la plantilla local del backend
            templatePath = path.join(__dirname, '../templates/email-reset-password.html');
        }
    }

    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    htmlTemplate = htmlTemplate.replace(/{{USER_NAME}}/g, user.first_name);
    htmlTemplate = htmlTemplate.replace(/{{RESET_LINK}}/g, resetUrl);
    htmlTemplate = htmlTemplate.replace(/{{EXPIRY_TIME}}/g, '15 minutos');

    // 5. Enviar el correo usando nodemailer configurado
    const fromAddress = process.env.EMAIL_USER || 'soporte@tudominio.com';
    await transporter.sendMail({
        from: `"CARLIZ - Panel Administrativo" <${fromAddress}>`,
        to: user.email,
        subject: "Recuperación de Contraseña - CARLIZ",
        html: htmlTemplate
    });

    return { message: "Se ha enviado un enlace de recuperación a tu correo electrónico." };
};

// --- NUEVA FUNCIÓN: CAMBIAR LA CONTRASEÑA ---
const resetPassword = async (token, newPassword) => {
    if (!newPassword) {
        throw new Error('La nueva contraseña es requerida.');
    }

    let decoded;
    try {
        // 1. Verificar si el token es válido y no ha expirado
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('El enlace es inválido o ha expirado. Por favor, solicita uno nuevo.');
    }

    // 2. Encriptar la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 3. Actualizar la base de datos
    await UserAccount.update(
        { password: hashedPassword },
        { where: { id_user: decoded.id } }
    );

    return { message: "Tu contraseña ha sido actualizada con éxito." };
};

module.exports = {
    login,
    sendResetPasswordEmail,
    resetPassword
};

