const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

router.get('/', authorize([1, 2, 3]), customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.put('/:id', authorize([1, 2, 3]), customerController.updateCustomer);
router.delete('/:id', authorize([1]), customerController.deleteCustomer);

module.exports = router;
