const paymentsService = require('../services/payment_services.js');

const getPayments = async (req, res) => {
  try {
    const data = await paymentsService.getAllPayments();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const newItem = await paymentsService.createPayment(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const updated = await paymentsService.updatePayment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'payment no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const deleted = await paymentsService.deletePayment(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'payment no encontrado' });
    res.json({ success: true, message: 'payment eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getPayments, createPayment, updatePayment, deletePayment };
