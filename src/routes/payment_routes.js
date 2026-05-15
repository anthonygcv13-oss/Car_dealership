const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment_controllers.js');
const installmentController = require('../controllers/installment_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

// src/routes/payment_routes.js
// El cajero (4) y el admin (1) manejan el dinero
router.get('/', authorize([1, 4]), paymentController.getPayments);
router.post('/', authorize([4]), paymentController.createPayment); 

// src/routes/installment_routes.js
router.get('/', authorize([1, 2, 4]), installmentController.getInstallments);
router.put('/:id', authorize([4]), installmentController.updateInstallment);

module.exports = router;
