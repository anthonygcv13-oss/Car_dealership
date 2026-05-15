const Installment = require('../models/installment.js');

const getAllInstallments = async () => {
    return await Installment.findAll();
};

const createInstallment = async (installmentData) => {
    const { number, amount, due_date, id_vehicle_sale, id_financing_plan } = installmentData;
    return await Installment.create({
        number,
        amount,
        due_date,
        id_vehicle_sale,
        id_financing_plan
    });
};

const updateInstallment = async (id, installmentData) => {
    const [updatedRows] = await Installment.update(installmentData, {
        where: { id_installment: id }
    });

    if (updatedRows === 0) return null;

    return await Installment.findByPk(id);
};

const deleteInstallment = async (id) => {
    const installmentToDelete = await Installment.findByPk(id);
    
    if (installmentToDelete) {
        await Installment.destroy({
            where: { id_installment: id }
        });
    }
    
    return installmentToDelete;
};

module.exports = { getAllInstallments, createInstallment, updateInstallment, deleteInstallment };
