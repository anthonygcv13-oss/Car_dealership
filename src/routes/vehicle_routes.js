const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

// src/routes/vehicle_routes.js
router.get('/', authorize([1, 2, 3]), vehicleController.getVehicles); // Todos ven
router.post('/', authorize([1, 2]), vehicleController.createVehicle); // Solo jefes
router.put('/:id', authorize([1, 2]), vehicleController.updateVehicle);
router.delete('/:id', authorize([1]), vehicleController.deleteVehicle); // Solo Admin

module.exports = router;
