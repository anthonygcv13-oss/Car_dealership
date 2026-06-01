const VehicleImage = require('../models/vehicle_image.js');

const getAllVehicleImages = async (filters = {}) => {
    const where = {};
    if (filters.id_vehicle) {
        where.id_vehicle = filters.id_vehicle;
    }
    return await VehicleImage.findAll({
        where,
        order: [
            ['display_order', 'ASC'],
            ['id_vehicle_image', 'ASC']
        ]
    });
};

const getVehicleImageById = async (id) => {
    return await VehicleImage.findByPk(id);
};

const createVehicleImage = async (imageData) => {
    const { id_vehicle, url, is_primary, display_order } = imageData;
    return await VehicleImage.create({
        id_vehicle,
        url,
        is_primary,
        display_order
    });
};

const updateVehicleImage = async (id, imageData) => {
    const [updatedRows] = await VehicleImage.update(imageData, {
        where: { id_vehicle_image: id }
    });

    if (updatedRows === 0) return null;

    return await VehicleImage.findByPk(id);
};

const deleteVehicleImage = async (id) => {
    const imageToDelete = await VehicleImage.findByPk(id);
    
    if (imageToDelete) {
        await VehicleImage.destroy({
            where: { id_vehicle_image: id }
        });
    }
    
    return imageToDelete;
};

module.exports = {
    getAllVehicleImages,
    getVehicleImageById,
    createVehicleImage,
    updateVehicleImage,
    deleteVehicleImage
};
