const vehicleService = require('../services/vehicle_sale_services.js');
const { saleSchema } = require('../validations/sale_validation'); // Importamos la validación que definimos antes

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
    // 1. Validar con Zod
    const validation = saleSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Error de validación en la venta",
        errors: validation.error.issues.map(err => ({
          campo: err.path[0],
          mensaje: err.message
        }))
      });
    }

    // 2. Llamar al servicio (que ahora hace el INSERT y el UPDATE del auto)
    const newItem = await vehicleService.createVehiclesale(validation.data);
    
    res.status(201).json({ 
      success: true, 
      message: "Venta registrada y estado del vehículo actualizado",
      data: newItem 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateVehiclesale = async (req, res) => {
  try {
    const updated = await vehicleService.updateVehiclesale(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Venta no encontrada' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteVehiclesale = async (req, res) => {
  try {
    const deleted = await vehicleService.deleteVehiclesale(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Venta no encontrada' });
    res.json({ success: true, message: 'Venta eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getVehiclesale, createVehiclesale, updateVehiclesale, deleteVehiclesale };