const VehicleVideo = require('../models/vehicle_video.js');

const getAllVehicleVideos = async (filters = {}) => {
    const where = {};
    if (filters.id_vehicle) {
        where.id_vehicle = filters.id_vehicle;
    }
    return await VehicleVideo.findAll({
        where,
        order: [
            ['display_order', 'ASC'],
            ['id_vehicle_video', 'ASC']
        ]
    });
};

const getVehicleVideoById = async (id) => {
    return await VehicleVideo.findByPk(id);
};

const createVehicleVideo = async (videoData) => {
    const { id_vehicle, url, is_primary, display_order } = videoData;
    return await VehicleVideo.create({
        id_vehicle,
        url,
        is_primary,
        display_order
    });
};

const updateVehicleVideo = async (id, videoData) => {
    const [updatedRows] = await VehicleVideo.update(videoData, {
        where: { id_vehicle_video: id }
    });

    if (updatedRows === 0) return null;

    return await VehicleVideo.findByPk(id);
};

const deleteVehicleVideo = async (id) => {
    const videoToDelete = await VehicleVideo.findByPk(id);
    
    if (videoToDelete) {
        await VehicleVideo.destroy({
            where: { id_vehicle_video: id }
        });
    }
    
    return videoToDelete;
};

module.exports = {
    getAllVehicleVideos,
    getVehicleVideoById,
    createVehicleVideo,
    updateVehicleVideo,
    deleteVehicleVideo
};
