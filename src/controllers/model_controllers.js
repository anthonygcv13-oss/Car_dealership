const modelsService = require('../services/model_services.js');

const getModels = async (req, res) => {
  try {
    const data = await modelsService.getAllModels();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createModel = async (req, res) => {
  try {
    const newItem = await modelsService.createModel(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateModel = async (req, res) => {
  try {
    const updated = await modelsService.updateModel(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'model no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteModel = async (req, res) => {
  try {
    const deleted = await modelsService.deleteModel(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'model no encontrado' });
    res.json({ success: true, message: 'model eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getModels, createModel, updateModel, deleteModel };
