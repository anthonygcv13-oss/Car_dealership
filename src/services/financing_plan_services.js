const FinancingPlan = require('../models/financing_plan.js');

const getAllFinancingPlans = async () => {
    return await FinancingPlan.findAll();
};

const createFinancingPlan = async (planData) => {
    const { name, interest_rate, number_installments } = planData;
    return await FinancingPlan.create({
        name,
        interest_rate,
        number_installments
    });
};

const updateFinancingPlan = async (id, planData) => {
    const [updatedRows] = await FinancingPlan.update(planData, {
        where: { id_financing_plan: id }
    });

    if (updatedRows === 0) return null;

    return await FinancingPlan.findByPk(id);
};

const deleteFinancingPlan = async (id) => {
    const planToDelete = await FinancingPlan.findByPk(id);
    
    if (planToDelete) {
        await FinancingPlan.destroy({
            where: { id_financing_plan: id }
        });
    }
    
    return planToDelete;
};

module.exports = { getAllFinancingPlans, createFinancingPlan, updateFinancingPlan, deleteFinancingPlan };
