const VehicleSale = require('../models/vehicle_sale.js');
const Vehicle = require('../models/vehicle.js');
const sequelize = require('../config/db.js');

const getAllVehiclesale = async () => {
    return await VehicleSale.findAll();
};

const createVehiclesale = async (saleData) => {
    const { date, final_price, sale_type, id_user, id_customer, id_vehicle, id_financing_plan } = saleData;

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
            id_financing_plan
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