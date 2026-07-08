const vehicleVideoServices = require('../services/vehicle_video_services.js');
const { createVehicleVideoSchema, updateVehicleVideoSchema } = require('../validations/vehicle_video_validation.js');

const getVehicleVideos = async (req, res) => {
    try {
        const { id_vehicle } = req.query;
        const filters = {};
        if (id_vehicle) {
            filters.id_vehicle = parseInt(id_vehicle, 10);
        }
        const data = await vehicleVideoServices.getAllVehicleVideos(filters);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getVehicleVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await vehicleVideoServices.getVehicleVideoById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Video de vehículo no encontrado" });
        }
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createVehicleVideo = async (req, res) => {
    try {
        const validation = createVehicleVideoSchema.safeParse(req.body);

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

        const newVideo = await vehicleVideoServices.createVehicleVideo(validation.data);
        res.status(201).json({ success: true, data: newVideo });
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

const updateVehicleVideo = async (req, res) => {
    try {
        const validation = updateVehicleVideoSchema.safeParse(req.body);

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

        const updated = await vehicleVideoServices.updateVehicleVideo(req.params.id, validation.data);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Video de vehículo no encontrado" });
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

const deleteVehicleVideo = async (req, res) => {
    try {
        const deleted = await vehicleVideoServices.deleteVehicleVideo(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Video de vehículo no encontrado" });
        }
        res.json({ success: true, message: "Video de vehículo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getVehicleVideos,
    getVehicleVideo,
    createVehicleVideo,
    updateVehicleVideo,
    deleteVehicleVideo
};
