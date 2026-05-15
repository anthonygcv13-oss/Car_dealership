const Payment = require('../models/payment.js');

const getAllPayments = async () => {
    return await Payment.findAll();
};

const createPayment = async (paymentData) => {
    const { date, amount, payment_method, id_user, id_vehicle_sale, id_installment } = paymentData;
    return await Payment.create({
        date,
        amount,
        payment_method,
        id_user,
        id_vehicle_sale,
        id_installment
    });
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
