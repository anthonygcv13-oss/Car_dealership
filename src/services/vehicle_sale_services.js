const VehicleSale = require('../models/vehicle_sale.js');
const Vehicle = require('../models/vehicle.js');
const Customer = require('../models/customer.js');
const Model = require('../models/model.js');
const sequelize = require('../config/db.js');
const notificationService = require('./notification_services.js');

const getAllVehiclesale = async () => {
    return await VehicleSale.findAll();
};

const createVehiclesale = async (saleData) => {
    const { date, final_price, sale_type, id_user, id_customer, id_vehicle, id_financing_plan, status } = saleData;

    // Usar sequelize.transaction() para asegurar atomicidad
    const result = await sequelize.transaction(async (transaction) => {
        // 1. Crear la venta
        const sale = await VehicleSale.create({
            date,
            final_price,
            sale_type,
            id_user,
            id_customer,
            id_vehicle,
            id_financing_plan,
            status
        }, { transaction });

        // 2. Actualizar el status del vehículo a 'sold'
        await Vehicle.update(
            { status: 'sold' },
            {
                where: { id_vehicle },
                transaction
            }
        );

        return sale;
    });

    try {
        const customer = await Customer.findByPk(id_customer);
        const vehicle = await Vehicle.findByPk(id_vehicle);
        let modelName = '';
        if (vehicle) {
            const modelObj = await Model.findByPk(vehicle.id_model);
            if (modelObj) modelName = modelObj.name;
        }

        const clientName = customer ? `${customer.first_name} ${customer.last_name}` : `ID ${id_customer}`;
        const vehicleName = modelName ? modelName : `Vehículo ID ${id_vehicle}`;
        const priceFormatted = parseFloat(final_price).toLocaleString('en-US');

        await notificationService.createNotification(
            'Nueva venta registrada',
            `Se registró una venta por $${priceFormatted} del vehículo ${vehicleName} a ${clientName}`,
            'success'
        );
    } catch (notifErr) {
        console.error("Error al crear notificación para la venta:", notifErr);
    }

    return result;
};

const updateVehiclesale = async (id, saleData) => {
    const [updatedRows] = await VehicleSale.update(saleData, {
        where: { id_vehicle_sale: id }
    });

    if (updatedRows === 0) return null;

    return await VehicleSale.findByPk(id);
};

const deleteVehiclesale = async (id) => {
    const saleToDelete = await VehicleSale.findByPk(id);
    
    if (saleToDelete) {
        await VehicleSale.destroy({
            where: { id_vehicle_sale: id }
        });
    }
    
    return saleToDelete;
};

module.exports = { getAllVehiclesale, createVehiclesale, updateVehiclesale, deleteVehiclesale };