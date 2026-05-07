const brandService = require('../services/brand_services.js');

const getBrands = async (req, res) => {
  try {
    const data = await brandService.getAllBrands();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const newItem = await brandService.createBrand(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const updated = await brandService.updateBrand(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'brand no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const deleted = await brandService.deleteBrand(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'brand no encontrado' });
    res.json({ success: true, message: 'brand eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };
