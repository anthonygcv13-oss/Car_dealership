const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

// src/routes/vehicle_routes.js
router.get('/available/:id_model', vehicleController.getAvailableVehicle);
router.get('/', authorize([1, 2, 3]), vehicleController.getVehicles); // Todos los usuarios autorizados (Admin, Vendedor, Gerente) pueden ver
router.post('/', authorize([1, 3]), vehicleController.createVehicle); // Solo Admin y Gerente pueden crear vehículos
router.put('/:id', authorize([1, 3]), vehicleController.updateVehicle); // Solo Admin y Gerente pueden actualizar vehículos
router.delete('/:id', authorize([1]), vehicleController.deleteVehicle); // Solo Admin puede eliminar vehículos

module.exports = router;
