const Vehicle = require('../models/vehicle.js');
const Model = require('../models/model.js');
const notificationService = require('./notification_services.js');

const getAllVehicles = async () => {
    return await Vehicle.findAll();
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

    return newVehicle;
};

const updateVehicle = async (id, vehicleData) => {
    const [updatedRows] = await Vehicle.update(vehicleData, {
        where: { id_vehicle: id }
    });

    if (updatedRows === 0) return null;

    return await Vehicle.findByPk(id);
};

const deleteVehicle = async (id) => {
    const vehicleToDelete = await Vehicle.findByPk(id);
    
    if (vehicleToDelete) {
        await Vehicle.destroy({
            where: { id_vehicle: id }
        });
    }
    
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
