const customersService = require('../services/customer_services.js');

const getCustomers = async (req, res) => {
  try {
    const data = await customersService.getAllCustomers();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const newItem = await customersService.createCustomer(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const updated = await customersService.updateCustomer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'customer no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const deleted = await customersService.deleteCustomer(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'customer no encontrado' });
    res.json({ success: true, message: 'customer eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
