const express = require('express');
const router = express.Router();
const modelController = require('../controllers/model_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

router.get('/', modelController.getModels);
router.post('/', authorize([1, 3]), modelController.createModel);
router.put('/:id', authorize([1, 3]), modelController.updateModel);
router.delete('/:id', authorize([1]), modelController.deleteModel);

module.exports = router;
