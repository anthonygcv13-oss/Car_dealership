const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand_controllers.js');

router.get('/', brandController.getBrands);
router.post('/', brandController.createBrand);
router.put('/:id', brandController.updateBrand);
router.delete('/:id', brandController.deleteBrand);

module.exports = router;
