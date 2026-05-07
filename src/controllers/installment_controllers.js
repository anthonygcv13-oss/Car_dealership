const installmentsService = require('../services/installment_services.js');

const getInstallments = async (req, res) => {
  try {
    const data = await installmentsService.getAllInstallments();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createInstallment = async (req, res) => {
  try {
    const newItem = await installmentsService.createInstallment(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateInstallment = async (req, res) => {
  try {
    const updated = await installmentsService.updateInstallment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'installment no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteInstallment = async (req, res) => {
  try {
    const deleted = await installmentsService.deleteInstallment(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'installment no encontrado' });
    res.json({ success: true, message: 'installment eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getInstallments, createInstallment, updateInstallment, deleteInstallment };
