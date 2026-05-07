const financingPlansService = require('../services/financing_plan_services.js');

const getFinancingPlans = async (req, res) => {
  try {
    const data = await financingPlansService.getAllFinancingPlans();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createFinancingPlan = async (req, res) => {
  try {
    const newItem = await financingPlansService.createFinancingPlan(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateFinancingPlan = async (req, res) => {
  try {
    const updated = await financingPlansService.updateFinancingPlan(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'financing plan no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteFinancingPlan = async (req, res) => {
  try {
    const deleted = await financingPlansService.deleteFinancingPlan(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'financing plan no encontrado' });
    res.json({ success: true, message: 'financing plan eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getFinancingPlans, createFinancingPlan, updateFinancingPlan, deleteFinancingPlan };
