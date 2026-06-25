const jwt = require('jsonwebtoken');

const authorize = (rolesPermitidos = []) => {
    return (req, res, next) => {
        // 1. Obtener el token del header (Authorization: Bearer TOKEN) o x-access-token
        const authHeader = req.headers.authorization || req.headers['x-access-token'];
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No autorizado, falta token" });
        }

        let token = authHeader;
        const bearerPrefix = 'bearer ';
        if (authHeader.toLowerCase().startsWith(bearerPrefix)) {
            token = authHeader.slice(bearerPrefix.length).trim();
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "No autorizado, falta token" });
        }

        try {
            // 2. Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporal');
            req.user = decoded; // Guardamos los datos del usuario en la petición

            // 3. Verificar si el rol está permitido
            // Si pasamos rolesPermitidos vacíos, solo pedimos que esté logueado
            if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false, 
                    message: "No tienes permisos suficientes para realizar esta acción" 
                });
            }

            next(); // Todo ok, pasamos al controlador
        } catch (error) {
            return res.status(401).json({ success: false, message: "Token inválido o expirado" });
        }
    };
};

module.exports = authorize;