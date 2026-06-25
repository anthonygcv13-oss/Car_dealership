const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

router.get('/', authorize([1, 2, 3]), brandController.getBrands);
router.post('/', authorize([1, 3]), brandController.createBrand);
router.put('/:id', authorize([1, 3]), brandController.updateBrand);
router.delete('/:id', authorize([1]), brandController.deleteBrand);

module.exports = router;
