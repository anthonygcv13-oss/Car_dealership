const express = require('express');
const router = express.Router();

// Importamos el archivo de rutas de user_account con su nombre correcto

const userAccountRoutes = require('./routes/user_account_routes.js');
const authRoutes = require('./routes/auth_routes'); // <-- Nueva línea
const vehicleRoutes = require('./routes/vehicle_routes.js');
const vehiclesaleRoutes = require('./routes/vehicle_sale_routes.js');

const supplierRoutes = require('./routes/supplier_routes.js');
const roleRoutes = require('./routes/role_routes.js');
const quoteRoutes = require('./routes/quote_routes.js');

const paymentRoutes = require('./routes/payment_routes.js');
const modelRoutes = require('./routes/model_routes.js');
const installmentRoutes = require('./routes/installment_routes.js');

const financingplanRoutes = require('./routes/financing_plan_routes.js');
const customerRoutes = require('./routes/customer_routes.js');
const brandRoutes = require('./routes/brand_routes.js');

const auditlogRoutes = require('./routes/audit_log_routes.js');
const profileRoutes = require('./routes/profile_routes.js');
const vehicleImageRoutes = require('./routes/vehicle_image_routes.js');
const notificationRoutes = require('./routes/notification_routes.js');

// Registramos estas rutas bajo el prefijo '/users'
// Esto significa que la URL final será /api/users/

router.use('/users', userAccountRoutes);
router.use('/auth', authRoutes); // <-- Nueva línea (Prefijo /auth)
router.use('/vehicles', vehicleRoutes);
router.use('/vehicle-sale', vehiclesaleRoutes);
router.use('/vehicle-images', vehicleImageRoutes);
router.use('/notifications', notificationRoutes);

router.use('/suppliers', supplierRoutes);
router.use('/roles', roleRoutes);
router.use('/quotes', quoteRoutes);

router.use('/payments', paymentRoutes);
router.use('/models', modelRoutes);
router.use('/installments', installmentRoutes);

router.use('/financing-plans', financingplanRoutes);
router.use('/customers', customerRoutes);
router.use('/brands', brandRoutes);

router.use('/audit-logs', auditlogRoutes);
router.use('/', profileRoutes);

// Aquí irás agregando más tablas después, ej:
// const vehicleRoutes = require('./routes/vehicle_routes');
// router.use('/vehicles', vehicleRoutes);

module.exports = router;