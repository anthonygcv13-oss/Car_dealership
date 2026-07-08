const VehicleSale = require('../models/vehicle_sale.js');
const Vehicle = require('../models/vehicle.js');
const Customer = require('../models/customer.js');
const Model = require('../models/model.js');
const sequelize = require('../config/db.js');
const notificationService = require('./notification_services.js');
const FinancingPlan = require('../models/financing_plan.js');
const Installment = require('../models/installment.js');

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

        // 3. Generar cuotas si es venta financiada
        if (sale_type === 'financed' && id_financing_plan) {
            const plan = await FinancingPlan.findByPk(id_financing_plan, { transaction });
            if (!plan) {
                throw new Error('El plan de financiamiento seleccionado no existe.');
            }

            const terms = plan.number_installments;
            const rate = parseFloat(plan.interest_rate);
            const price = parseFloat(final_price);

            // Cálculo con interés simple sobre el precio final de venta
            const totalAmount = price * (1 + rate / 100);
            const installmentAmount = parseFloat((totalAmount / terms).toFixed(2));

            const installmentsToCreate = [];
            for (let i = 1; i <= terms; i++) {
                const dueDate = new Date(date);
                dueDate.setDate(dueDate.getDate() + (30 * i)); // Cada cuota vence cada 30 días

                installmentsToCreate.push({
                    number: i,
                    amount: installmentAmount,
                    due_date: dueDate,
                    id_vehicle_sale: sale.id_vehicle_sale,
                    id_financing_plan: plan.id_financing_plan,
                    status: 'pending'
                });
            }

            await Installment.bulkCreate(installmentsToCreate, { transaction });
        }

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
    const result = await sequelize.transaction(async (transaction) => {
        // 1. Obtener la venta antes de actualizar
        const originalSale = await VehicleSale.findByPk(id, { transaction });
        if (!originalSale) return null;

        const oldVehicleId = originalSale.id_vehicle;
        const oldStatus = originalSale.status;

        // 2. Actualizar la venta
        await VehicleSale.update(saleData, {
            where: { id_vehicle_sale: id },
            transaction
        });

        const updatedSale = await VehicleSale.findByPk(id, { transaction });

        const newVehicleId = updatedSale.id_vehicle;
        const newStatus = updatedSale.status;

        // 3. Manejar cambio de vehículo o cambio de estado de la venta
        if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
            // Venta cancelada: liberar el vehículo original
            await Vehicle.update({ status: 'available' }, { where: { id_vehicle: oldVehicleId }, transaction });
        } 
        else if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
            // Venta reactivada: marcar el vehículo actual como vendido
            await Vehicle.update({ status: 'sold' }, { where: { id_vehicle: newVehicleId }, transaction });
        } 
        else if (newStatus !== 'cancelled') {
            // Venta activa: si se cambió de vehículo, liberar el viejo y marcar como vendido el nuevo
            if (oldVehicleId !== newVehicleId) {
                await Vehicle.update({ status: 'available' }, { where: { id_vehicle: oldVehicleId }, transaction });
                await Vehicle.update({ status: 'sold' }, { where: { id_vehicle: newVehicleId }, transaction });
            }
        }

        return updatedSale;
    });

    return result;
};

const deleteVehiclesale = async (id) => {
    const result = await sequelize.transaction(async (transaction) => {
        const saleToDelete = await VehicleSale.findByPk(id, { transaction });
        if (!saleToDelete) return null;

        // Si la venta no estaba cancelada, liberamos el vehículo
        if (saleToDelete.status !== 'cancelled') {
            await Vehicle.update(
                { status: 'available' },
                { where: { id_vehicle: saleToDelete.id_vehicle }, transaction }
            );
        }

        await VehicleSale.destroy({
            where: { id_vehicle_sale: id },
            transaction
        });

        return saleToDelete;
    });

    return result;
};

module.exports = { getAllVehiclesale, createVehiclesale, updateVehiclesale, deleteVehiclesale };