const express = require('express');
const router = express.Router();
const modelController = require('../controllers/model_controllers.js');

router.get('/', modelController.getModels);
router.post('/', modelController.createModel);
router.put('/:id', modelController.updateModel);
router.delete('/:id', modelController.deleteModel);

module.exports = router;
