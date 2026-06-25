const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role_controllers.js');
const authorize = require('../middleware/auth_middleware.js');

router.get('/', authorize([1, 3]), roleController.getRoles);
router.post('/', authorize([1]), roleController.createRole);
router.put('/:id', authorize([1]), roleController.updateRole);
router.delete('/:id', authorize([1]), roleController.deleteRole);

module.exports = router;
