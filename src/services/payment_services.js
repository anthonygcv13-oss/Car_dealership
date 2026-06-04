const Payment = require('../models/payment.js');
const notificationService = require('./notification_services.js');

const getAllPayments = async () => {
    return await Payment.findAll();
};

const createPayment = async (paymentData) => {
    const { date, amount, payment_method, id_user, id_vehicle_sale, id_installment } = paymentData;
    const newPayment = await Payment.create({
        date,
        amount,
        payment_method,
        id_user,
        id_vehicle_sale,
        id_installment
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

    return newPayment;
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
