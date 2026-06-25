const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

router.get('/', authorize([1, 3]), supplierController.getSuppliers);
router.post('/', authorize([1, 3]), supplierController.createSupplier);
router.put('/:id', authorize([1, 3]), supplierController.updateSupplier);
router.delete('/:id', authorize([1]), supplierController.deleteSupplier);

module.exports = router;
