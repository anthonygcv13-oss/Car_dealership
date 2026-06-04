const express = require('express');
const router = express.Router();
const vehicleSaleController = require('../controllers/vehicle_sale_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

// src/routes/vehicle_sale_routes.js
router.get('/', authorize([1, 2, 3]), vehicleSaleController.getVehiclesale);
router.post('/', authorize([1, 2, 3]), vehicleSaleController.createVehiclesale); // Admin, Vendedor y Gerente pueden crear ventas
router.put('/:id', authorize([1, 2, 3]), vehicleSaleController.updateVehiclesale); // Admin, Vendedor y Gerente pueden actualizar ventas
router.delete('/:id', authorize([1, 3]), vehicleSaleController.deleteVehiclesale); // Admin y Gerente pueden eliminar ventas

module.exports = router;
