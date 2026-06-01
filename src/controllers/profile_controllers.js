const profileServices = require('../services/profile_services');
const { profileUpdateSchema } = require('../validations/user_validation');

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await profileServices.getProfile(userId);
        
        res.json({
            success: true,
            data: {
                id: user.id_user,
                email: user.email,
                nombre: user.first_name,
                apellido: user.last_name,
                rol: user.id_role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Validar los datos con Zod
        const validation = profileUpdateSchema.safeParse(req.body);

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

        // 2. Llamar al servicio para actualizar
        const updatedUser = await profileServices.updateProfile(userId, validation.data);

        res.json({
            success: true,
            data: {
                id: updatedUser.id_user,
                email: updatedUser.email,
                nombre: updatedUser.first_name,
                apellido: updatedUser.last_name,
                rol: updatedUser.id_role
            }
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: "El correo electrónico ya está registrado"
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
