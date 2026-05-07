const vehicleService = require('../services/vehicle_services.js');

const getVehicles = async (req, res) => {
  try {
    const data = await vehicleService.getAllVehicles();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createVehicle = async (req, res) => {
  try {
    const newItem = await vehicleService.createVehicle(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const updated = await vehicleService.updateVehicle(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'vehicle no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const deleted = await vehicleService.deleteVehicle(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'vehicle no encontrado' });
    res.json({ success: true, message: 'vehicle eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle };
