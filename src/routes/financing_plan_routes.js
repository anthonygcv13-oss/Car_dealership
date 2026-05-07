const express = require('express');
const router = express.Router();
const financingPlanController = require('../controllers/financing_plan_controllers.js');

router.get('/', financingPlanController.getFinancingPlans);
router.post('/', financingPlanController.createFinancingPlan);
router.put('/:id', financingPlanController.updateFinancingPlan);
router.delete('/:id', financingPlanController.deleteFinancingPlan);

module.exports = router;
