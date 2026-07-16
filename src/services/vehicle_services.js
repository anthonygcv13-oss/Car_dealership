const Vehicle = require('../models/vehicle.js');
const Model = require('../models/model.js');
const VehicleImage = require('../models/vehicle_image.js');
const VehicleVideo = require('../models/vehicle_video.js');
const notificationService = require('./notification_services.js');
const cache = require('../config/redis.js');

const getAllVehicles = async () => {
    // 1. Intentar obtener de la caché Redis
    const cachedVehicles = await cache.getCache(cache.keys.VEHICLES);
    if (cachedVehicles) {
        console.log('⚡ [Caché Redis] Retornando lista de vehículos desde la caché');
        return cachedVehicles;
    }

    // 2. Si no hay caché, consultar base de datos
    const data = await Vehicle.findAll({
        include: [
            { model: VehicleImage, as: 'images' },
            { model: VehicleVideo, as: 'videos' }
        ]
    });

    // 3. Guardar en caché Redis
    await cache.setCache(cache.keys.VEHICLES, data);
    return data;
};

const createVehicle = async (vehicleData) => {
    const { license_plate, vehicle_serial, engine_serial, body_serial, manufacture_date, purchase_date, mileage, color, id_model, id_brand, year, purchase_price, sale_price, id_supplier } = vehicleData;
    const newVehicle = await Vehicle.create({
        license_plate,
        vehicle_serial,
        engine_serial,
        body_serial,
        manufacture_date,
        purchase_date,
        mileage,
        color,
        id_model,
        id_brand,
        year,
        purchase_price,
        sale_price,
        id_supplier
    });

    try {
        const modelObj = await Model.findByPk(id_model);
        const vehicleName = modelObj ? modelObj.name : `ID ${id_model}`;

        await notificationService.createNotification(
            'Vehículo agregado',
            `Se agregó un nuevo ${vehicleName} al inventario`,
            'info'
        );
    } catch (notifErr) {
        console.error("Error al crear notificación para el vehículo:", notifErr);
    }

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.VEHICLES);
    await cache.deleteCache(cache.keys.MODELS);

    return newVehicle;
};

const updateVehicle = async (id, vehicleData) => {
    const [updatedRows] = await Vehicle.update(vehicleData, {
        where: { id_vehicle: id }
    });

    if (updatedRows === 0) return null;

    const updatedVehicle = await Vehicle.findByPk(id);

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.VEHICLES);
    await cache.deleteCache(cache.keys.MODELS);

    return updatedVehicle;
};

const deleteVehicle = async (id) => {
    const vehicleToDelete = await Vehicle.findByPk(id);
    
    if (vehicleToDelete) {
        await Vehicle.destroy({
            where: { id_vehicle: id }
        });
    }

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.VEHICLES);
    await cache.deleteCache(cache.keys.MODELS);
    
    return vehicleToDelete;
};

const getFirstAvailableVehicle = async (id_model) => {
    return await Vehicle.findOne({
        where: {
            id_model: id_model,
            status: 'available'
        }
    });
};

module.exports = { getAllVehicles, createVehicle, updateVehicle, deleteVehicle, getFirstAvailableVehicle };
