const express = require('express');
const router = express.Router();
const installmentController = require('../controllers/installment_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

router.get('/', authorize([1, 2, 3, 4]), installmentController.getInstallments);
router.post('/', authorize([1, 4]), installmentController.createInstallment);
router.put('/:id', authorize([1, 4]), installmentController.updateInstallment);
router.delete('/:id', authorize([1]), installmentController.deleteInstallment);

module.exports = router;
