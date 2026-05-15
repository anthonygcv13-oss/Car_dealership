const express = require('express');
const router = express.Router();
const userAccountControllers = require('../controllers/user_account_controllers');
const authorize = require('../middleware/auth_middleware.js'); // Importamos el middleware

// --- RUTAS PROTEGIDAS ---

// Solo el Admin (Rol 1) puede ver la lista de todos los usuarios
router.get('/', authorize([1,2,5]), userAccountControllers.getUserAccounts);

// Solo el Admin puede crear nuevas cuentas (por ejemplo, para otros empleados)
router.post('/', authorize([1]), userAccountControllers.createAccount);

// Solo el Admin puede actualizar cuentas ajenas
router.put('/:id', authorize([1]), userAccountControllers.updateAccount);

// Solo el Admin tiene permiso para eliminar usuarios del sistema
router.delete('/:id', authorize([1]), userAccountControllers.deleteAccount);

module.exports = router;