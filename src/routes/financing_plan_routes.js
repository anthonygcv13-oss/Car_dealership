const express = require('express');
const router = express.Router();
const financingPlanController = require('../controllers/financing_plan_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

router.get('/', financingPlanController.getFinancingPlans);
router.post('/', authorize([1, 3]), financingPlanController.createFinancingPlan);
router.put('/:id', authorize([1, 3]), financingPlanController.updateFinancingPlan);
router.delete('/:id', authorize([1]), financingPlanController.deleteFinancingPlan);

module.exports = router;
