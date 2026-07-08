const express = require('express');
const multer = require('multer');
const router = express.Router();
const vehicleImageController = require('../controllers/vehicle_image_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public routes (anyone can see vehicle images)
router.get('/', vehicleImageController.getVehicleImages);
router.get('/:id', vehicleImageController.getVehicleImage);

// Protected routes (Admin & Manager can add / edit images)
router.post('/', authorize([1, 3]), upload.single('image'), vehicleImageController.createVehicleImage);
router.put('/:id', authorize([1, 3]), upload.single('image'), vehicleImageController.updateVehicleImage);

// Only Admin can delete vehicle images
router.delete('/:id', authorize([1]), vehicleImageController.deleteVehicleImage);

module.exports = router;
