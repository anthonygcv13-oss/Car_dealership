const express = require('express');
const router = express.Router();
const vehicleSaleController = require('../controllers/vehicle_sale_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

// src/routes/vehicle_sale_routes.js
router.get('/', authorize([1, 2, 3]), vehicleSaleController.getVehiclesale);
router.post('/', authorize([3]), vehicleSaleController.createVehiclesale); // Solo vendedores venden
router.delete('/:id', authorize([1, 2]), vehicleSaleController.deleteVehiclesale);

module.exports = router;
