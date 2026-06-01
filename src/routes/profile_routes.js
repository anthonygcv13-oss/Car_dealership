const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth_middleware');
const profileControllers = require('../controllers/profile_controllers');

// GET /api/profile
router.get('/profile', authorize(), profileControllers.getProfile);

// PUT /api/profile_update
router.put('/profile_update', authorize(), profileControllers.updateProfile);

// POST /api/profile_update (soporte de fallback opcional)
router.post('/profile_update', authorize(), profileControllers.updateProfile);

module.exports = router;
