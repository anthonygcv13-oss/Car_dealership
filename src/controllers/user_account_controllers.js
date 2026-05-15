const userAccountServices = require('../services/user_account_services.js');
const { userSchema } = require('../validations/user_validation'); // Importamos el esquema

// --- OBTENER TODOS ---
const getUserAccounts = async (req, res) => {
    try {
        // Con Sequelize, 'data' ya es el array de objetos directamente
        const data = await userAccountServices.getAllUserAccounts();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- CREAR CON VALIDACIÓN ZOD ---
const createAccount = async (req, res) => {
    try {
        // 1. Validar los datos con Zod
        const validation = userSchema.safeParse(req.body);

        // 2. Manejo de errores de validación (Se mantiene igual, ¡está perfecto!)
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                errors: validation.error.issues.map(err => ({
                    campo: err.path[0],
                    mensaje: err.message
                }))
            });
        }

        // 3. Usar validation.data (los datos ya limpios y validados)
        const newUser = await userAccountServices.createUserAccount(validation.data);
        res.status(201).json({ success: true, data: newUser });

    } catch (error) {
        // Sequelize suele dar errores de 'UniqueConstraintError' si el email ya existe
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ success: false, message: "El correo electrónico ya está registrado" });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- ACTUALIZAR ---
const updateAccount = async (req, res) => {
    try {
        const updated = await userAccountServices.updateUserAccount(req.params.id, req.body);
        
        // Si el service devuelve null es porque findByPk no encontró el registro después del update
        if (!updated) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
        
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// --- ELIMINAR ---
const deleteAccount = async (req, res) => {
    try {
        const deleted = await userAccountServices.deleteUserAccount(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
        
        res.json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getUserAccounts, createAccount, updateAccount, deleteAccount };