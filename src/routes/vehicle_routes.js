const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle_controllers.js');

router.get('/', vehicleController.getVehicles);
router.post('/', vehicleController.createVehicle);
router.put('/:id', vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
