const express = require('express');
const multer = require('multer');
const router = express.Router();
const brandImageController = require('../controllers/brand_image_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', brandImageController.getBrandImages);
router.get('/:id', brandImageController.getBrandImage);
router.post('/', authorize([1, 3]), upload.single('image'), brandImageController.createBrandImage);
router.put('/:id', authorize([1, 3]), upload.single('image'), brandImageController.updateBrandImage);
router.delete('/:id', authorize([1]), brandImageController.deleteBrandImage);

module.exports = router;
