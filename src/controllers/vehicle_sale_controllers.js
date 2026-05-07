const vehicleService = require('../services/vehicle_sale_services.js');

const getVehiclesale = async (req, res) => {
  try {
    const data = await vehicleService.getAllVehiclesale();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createVehiclesale = async (req, res) => {
  try {
    const newItem = await vehicleService.createVehiclesale(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateVehiclesale = async (req, res) => {
  try {
    const updated = await vehicleService.updateVehiclesale(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'vehicle sale no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteVehiclesale = async (req, res) => {
  try {
    const deleted = await vehicleService.deleteVehiclesale(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'vehicle sale no encontrado' });
    res.json({ success: true, message: 'vehicle sale eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getVehiclesale, createVehiclesale, updateVehiclesale, deleteVehiclesale };
