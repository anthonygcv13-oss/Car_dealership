const express = require('express');
const router = express.Router();
const vehicleSaleController = require('../controllers/vehicle_sale_controllers.js');

router.get('/', vehicleSaleController.getVehiclesale);
router.post('/', vehicleSaleController.createVehiclesale);
router.put('/:id', vehicleSaleController.updateVehiclesale);
router.delete('/:id', vehicleSaleController.deleteVehiclesale);

module.exports = router;
