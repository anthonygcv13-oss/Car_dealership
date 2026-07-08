const express = require('express');
const router = express.Router();
const vehicleVideoController = require('../controllers/vehicle_video_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

router.get('/', vehicleVideoController.getVehicleVideos);
router.get('/:id', vehicleVideoController.getVehicleVideo);
router.post('/', authorize([1, 3]), vehicleVideoController.createVehicleVideo);
router.put('/:id', authorize([1, 3]), vehicleVideoController.updateVehicleVideo);
router.delete('/:id', authorize([1]), vehicleVideoController.deleteVehicleVideo);

module.exports = router;
