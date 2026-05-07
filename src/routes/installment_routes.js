const express = require('express');
const router = express.Router();
const installmentController = require('../controllers/installment_controllers.js');

router.get('/', installmentController.getInstallments);
router.post('/', installmentController.createInstallment);
router.put('/:id', installmentController.updateInstallment);
router.delete('/:id', installmentController.deleteInstallment);

module.exports = router;
