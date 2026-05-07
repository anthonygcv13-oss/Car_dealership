const suppliersService = require('../services/supplier_services.js');

const getSuppliers = async (req, res) => {
  try {
    const data = await suppliersService.getAllSupplier();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const newItem = await suppliersService.createSupplier(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const updated = await suppliersService.updateSupplier(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'supplier no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const deleted = await suppliersService.deleteSupplier(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'supplier no encontrado' });
    res.json({ success: true, message: 'supplier eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
