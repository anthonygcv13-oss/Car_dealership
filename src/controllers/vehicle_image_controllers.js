const vehicleImageServices = require('../services/vehicle_image_services.js');
const { createVehicleImageSchema, updateVehicleImageSchema } = require('../validations/vehicle_image_validation.js');

const getVehicleImages = async (req, res) => {
    try {
        const { id_vehicle } = req.query;
        const filters = {};
        if (id_vehicle) {
            filters.id_vehicle = parseInt(id_vehicle, 10);
        }
        const data = await vehicleImageServices.getAllVehicleImages(filters);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getVehicleImage = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await vehicleImageServices.getVehicleImageById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Imagen de vehículo no encontrada" });
        }
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createVehicleImage = async (req, res) => {
    try {
        const validation = createVehicleImageSchema.safeParse(req.body);

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

        const newImage = await vehicleImageServices.createVehicleImage(validation.data);
        res.status(201).json({ success: true, data: newImage });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                success: false, 
                message: "El vehículo especificado no existe o el ID de referencia es inválido" 
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateVehicleImage = async (req, res) => {
    try {
        const validation = updateVehicleImageSchema.safeParse(req.body);

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

        const updated = await vehicleImageServices.updateVehicleImage(req.params.id, validation.data);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Imagen de vehículo no encontrada" });
        }
        res.json({ success: true, data: updated });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                success: false, 
                message: "El vehículo especificado no existe o el ID de referencia es inválido" 
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteVehicleImage = async (req, res) => {
    try {
        const deleted = await vehicleImageServices.deleteVehicleImage(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Imagen de vehículo no encontrada" });
        }
        res.json({ success: true, message: "Imagen de vehículo eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getVehicleImages,
    getVehicleImage,
    createVehicleImage,
    updateVehicleImage,
    deleteVehicleImage
};
