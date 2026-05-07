const express = require('express');
const router = express.Router();
const userAccountControllers = require('../controllers/user_account_controllers');

// GET -> Obtener todos
router.get('/', userAccountControllers.getUserAccounts);           // LEER
router.post('/', userAccountControllers.createAccount);          // CREAR
router.put('/:id', userAccountControllers.updateAccount);        // ACTUALIZAR (usa :id)
router.delete('/:id', userAccountControllers.deleteAccount);     // ELIMINAR (usa :id)

module.exports = router;