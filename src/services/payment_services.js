const Payment = require('../models/payment.js');
const notificationService = require('./notification_services.js');
const Installment = require('../models/installment.js');
const VehicleSale = require('../models/vehicle_sale.js');
const sequelize = require('../config/db.js');

const getAllPayments = async () => {
    return await Payment.findAll();
};

const createPayment = async (paymentData) => {
    const { date, amount, payment_method, id_user, id_vehicle_sale, id_installment } = paymentData;

    const result = await sequelize.transaction(async (transaction) => {
        const newPayment = await Payment.create({
            date,
            amount,
            payment_method,
            id_user,
            id_vehicle_sale,
            id_installment
        }, { transaction });

        // Si se paga una cuota específica, la marcamos como pagada
        if (id_installment) {
            await Installment.update(
                { status: 'paid' },
                { where: { id_installment }, transaction }
            );

            // Contar cuántas cuotas pendientes quedan para esta venta
            const pendingCount = await Installment.count({
                where: {
                    id_vehicle_sale,
                    status: 'pending'
                },
                transaction
            });

            // Si todas las cuotas están pagas, la venta pasa a estar completada (paid)
            if (pendingCount === 0) {
                await VehicleSale.update(
                    { status: 'paid' },
                    { where: { id_vehicle_sale }, transaction }
                );
            }
        }

        return newPayment;
    });

    try {
        const amountFormatted = parseFloat(amount).toLocaleString('en-US');
        const methodMap = {
            'cash': 'Efectivo',
            'card': 'Tarjeta',
            'transfer': 'Transferencia'
        };
        const methodStr = methodMap[payment_method] || payment_method;

        await notificationService.createNotification(
            'Pago registrado',
            `Se registró un pago por $${amountFormatted} USD vía ${methodStr}`,
            'success'
        );
    } catch (notifErr) {
        console.error("Error al crear notificación para el pago:", notifErr);
    }

    return result;
};

const updatePayment = async (id, paymentData) => {
    const [updatedRows] = await Payment.update(paymentData, {
        where: { id_payment: id }
    });

    if (updatedRows === 0) return null;

    return await Payment.findByPk(id);
};

const deletePayment = async (id) => {
    const paymentToDelete = await Payment.findByPk(id);
    
    if (paymentToDelete) {
        await Payment.destroy({
            where: { id_payment: id }
        });
    }
    
    return paymentToDelete;
};

module.exports = { getAllPayments, createPayment, updatePayment, deletePayment };
