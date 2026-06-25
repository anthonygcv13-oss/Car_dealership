const authServices = require('../services/auth_services.js');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Llamamos al servicio de login
        const user = await authServices.login(email, password);
        
        res.json({
            success: true,
            message: "Login exitoso",
            user: user
        });
    } catch (error) {
        // Manejamos los errores de "No encontrado" o "Contraseña incorrecta"
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
};

// --- SOLICITAR RECUPERACIÓN (NUEVO) ---
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Llamamos al servicio que busca al usuario y envía el correo
        const result = await authServices.sendResetPasswordEmail(email);
        
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// --- RESTABLECER CONTRASEÑA (NUEVO) ---
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params; // Viene de la URL
        const newPassword = req.body.newPassword || req.body.password;
        
        // Llamamos al servicio que valida el token y actualiza la DB
        const result = await authServices.resetPassword(token, newPassword);
        
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// --- REDIRIGIR AL FRONTEND (GET) ---
const redirectResetPassword = async (req, res) => {
    const { token } = req.params;
    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3001';
    res.redirect(301, `${frontendUrl}/reset-password?token=${token}`);
};

// IMPORTANTE: Exportar todas las funciones
module.exports = { 
    login, 
    forgotPassword, 
    resetPassword,
    redirectResetPassword
};