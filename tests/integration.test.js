const request = require('supertest');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const app = require('../src/app.js');
const sequelize = require('../src/config/db.js');

// Importamos los modelos para realizar la limpieza de la base de datos
const Brand = require('../src/models/brand.js');
const Model = require('../src/models/model.js');
const Customer = require('../src/models/customer.js');
const Role = require('../src/models/role.js');
const Supplier = require('../src/models/supplier.js');
const FinancingPlan = require('../src/models/financing_plan.js');
const Vehicle = require('../src/models/vehicle.js');

// Listas para almacenar IDs creados durante las pruebas y asegurar su limpieza
const createdBrandIds = [];
const createdModelIds = [];
const createdCustomerIds = [];
const createdRoleIds = [];
const createdSupplierIds = [];
const createdFinancingPlanIds = [];
const createdVehicleIds = [];

// Generación de tokens JWT válidos para simular diferentes roles
const tokenSecret = process.env.JWT_SECRET || 'secret_key_temporal';
const generateTestToken = (userId, roleId) => {
  return jwt.sign({ id: userId, role: roleId }, tokenSecret, { expiresIn: '1h' });
};

const adminToken = generateTestToken(101, 1);    // Rol 1: Admin
const sellerToken = generateTestToken(103, 2);   // Rol 2: Vendedor (Seller)
const managerToken = generateTestToken(102, 3);  // Rol 3: Gerente (Manager)
const guestToken = generateTestToken(104, 5);    // Rol 5: Soporte / No permitido

// ==========================================
// ESQUEMAS DE VALIDACIÓN ZOD PARA RESPUESTAS
// ==========================================

const brandSchema = z.object({
  id_brand: z.number().int(),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  country_origin: z.string().nullable().optional(),
  website: z.string().nullable().optional()
});

const modelSchema = z.object({
  id_model: z.number().int(),
  name: z.string().nullable().optional(),
  id_brand: z.number().int().nullable().optional(),
  fuel_type: z.string().nullable().optional(),
  transmission: z.string().nullable().optional(),
  body_type: z.string().nullable().optional()
});

const customerSchema = z.object({
  id_customer: z.number().int(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  document: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  address: z.string().nullable().optional()
});

const roleSchema = z.object({
  id_role: z.number().int(),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional()
});

const supplierSchema = z.object({
  id_supplier: z.number().int(),
  name: z.string().nullable().optional(),
  tax_id: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  payment_terms: z.string().nullable().optional()
});

const financingPlanSchema = z.object({
  id_financing_plan: z.number().int(),
  name: z.string().nullable().optional(),
  interest_rate: z.union([z.number(), z.string()]).nullable().optional(),
  number_installments: z.number().int().nullable().optional()
});

const vehicleSchema = z.object({
  id_vehicle: z.number().int(),
  license_plate: z.string().nullable().optional(),
  vehicle_serial: z.string().nullable().optional(),
  engine_serial: z.string().nullable().optional(),
  body_serial: z.string().nullable().optional(),
  mileage: z.union([z.number(), z.string()]).nullable().optional(),
  color: z.string().nullable().optional(),
  id_model: z.number().int().nullable().optional(),
  id_brand: z.number().int().nullable().optional(),
  year: z.number().int().nullable().optional(),
  purchase_price: z.union([z.number(), z.string()]).nullable().optional(),
  sale_price: z.union([z.number(), z.string()]).nullable().optional(),
  id_supplier: z.number().int().nullable().optional(),
  status: z.string().nullable().optional()
});

// Esquema de envoltura para respuestas exitosas de tipo lista
const listResponseSchema = (itemSchema) => z.object({
  success: z.literal(true),
  data: z.array(itemSchema)
});

// Esquema de envoltura para respuestas exitosas de tipo detalle
const detailResponseSchema = (itemSchema) => z.object({
  success: z.literal(true),
  data: itemSchema
});

// Esquema para respuestas de error comunes
const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().optional(),
  message: z.string().optional()
});

// ==========================================
// PRUEBAS DE INTEGRACIÓN
// ==========================================

describe('Pruebas de Integración - API Car Dealership', () => {

  beforeAll(async () => {
    const Notification = require('../src/models/notification.js');
    await Notification.sync();
  });

  // Limpieza final de la base de datos tras ejecutar todas las pruebas
  afterAll(async () => {
    // 1. Eliminar vehículos primero para evitar FK violations
    for (const id of createdVehicleIds) {
      await Vehicle.destroy({ where: { id_vehicle: id } }).catch(() => {});
    }
    // 2. Eliminar modelos
    for (const id of createdModelIds) {
      await Model.destroy({ where: { id_model: id } }).catch(() => {});
    }
    // 3. Eliminar marcas
    for (const id of createdBrandIds) {
      await Brand.destroy({ where: { id_brand: id } }).catch(() => {});
    }
    // 4. Eliminar clientes
    for (const id of createdCustomerIds) {
      await Customer.destroy({ where: { id_customer: id } }).catch(() => {});
    }
    // 5. Eliminar roles
    for (const id of createdRoleIds) {
      await Role.destroy({ where: { id_role: id } }).catch(() => {});
    }
    // 6. Eliminar proveedores
    for (const id of createdSupplierIds) {
      await Supplier.destroy({ where: { id_supplier: id } }).catch(() => {});
    }
    // 7. Eliminar planes de financiamiento
    for (const id of createdFinancingPlanIds) {
      await FinancingPlan.destroy({ where: { id_financing_plan: id } }).catch(() => {});
    }

    // Cerrar la conexión de la base de datos
    await sequelize.close();
  });

  // ----------------------------------------------------
  // ENDPOINTS DE MARCAS (BRANDS)
  // ----------------------------------------------------
  describe('Endpoints de Marcas (/api/brands)', () => {
    
    test('GET /api/brands - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .get('/api/brands')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/brands - Con Token Válido - Debe retornar lista de marcas y coincidir con el esquema Zod', async () => {
      const response = await request(app)
        .get('/api/brands')
        .set('Authorization', `Bearer ${sellerToken}`)
        .expect(200);

      const validation = listResponseSchema(brandSchema).safeParse(response.body);
      expect(validation.success).toBe(true);
    });

    test('POST /api/brands - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .post('/api/brands')
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('POST /api/brands - Con Token Admin - Debe crear una nueva marca y coincidir con el esquema Zod', async () => {
      const newBrandData = {
        name: 'Tesla Test Integration',
        description: 'Vehículos eléctricos de prueba',
        country_origin: 'USA',
        website: 'https://tesla-test-integration.com'
      };

      const response = await request(app)
        .post('/api/brands')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newBrandData)
        .expect(201);

      const validation = detailResponseSchema(brandSchema).safeParse(response.body);
      expect(validation.success).toBe(true);

      if (response.body.data && response.body.data.id_brand) {
        createdBrandIds.push(response.body.data.id_brand);
      }
    });
  });

  // ----------------------------------------------------
  // ENDPOINTS DE MODELOS (MODELS)
  // ----------------------------------------------------
  describe('Endpoints de Modelos (/api/models)', () => {
    let testBrandId = null;

    beforeAll(async () => {
      const tempBrand = await Brand.create({
        name: 'Brand for Model Test',
        description: 'Marca temporal para pruebas de modelos',
        country_origin: 'Japan',
        website: 'https://tempbrand.com'
      });
      testBrandId = tempBrand.id_brand;
      createdBrandIds.push(testBrandId);
    });

    test('GET /api/models - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .get('/api/models')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/models - Con Token Válido - Debe retornar lista de modelos y coincidir con el esquema Zod', async () => {
      const response = await request(app)
        .get('/api/models')
        .set('Authorization', `Bearer ${sellerToken}`)
        .expect(200);

      const validation = listResponseSchema(modelSchema).safeParse(response.body);
      expect(validation.success).toBe(true);
    });

    test('POST /api/models - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .post('/api/models')
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('POST /api/models - Con Token Admin - Debe crear un nuevo modelo y coincidir con el esquema Zod', async () => {
      const newModelData = {
        name: 'Model X Test',
        id_brand: testBrandId,
        fuel_type: 'electric',
        transmission: 'automatic',
        body_type: 'suv'
      };

      const response = await request(app)
        .post('/api/models')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newModelData)
        .expect(201);

      const validation = detailResponseSchema(modelSchema).safeParse(response.body);
      expect(validation.success).toBe(true);

      if (response.body.data && response.body.data.id_model) {
        createdModelIds.push(response.body.data.id_model);
      }
    });
  });

  // ----------------------------------------------------
  // ENDPOINTS DE CLIENTES (CUSTOMERS)
  // ----------------------------------------------------
  describe('Endpoints de Clientes (/api/customers)', () => {
    
    test('GET /api/customers - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .get('/api/customers')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/customers - Con Token Válido - Debe retornar lista de clientes y coincidir con el esquema Zod', async () => {
      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${sellerToken}`)
        .expect(200);

      const validation = listResponseSchema(customerSchema).safeParse(response.body);
      expect(validation.success).toBe(true);
    });

    test('POST /api/customers - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({ first_name: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('POST /api/customers - Con Token Válido - Debe crear un nuevo cliente y coincidir con el esquema Zod', async () => {
      const newCustomerData = {
        first_name: 'John Integration',
        last_name: 'Doe Test',
        document: '999888777-I',
        phone: '555-987654',
        email: 'john.doe.integration@test.com',
        address: '123 Test Street'
      };

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(newCustomerData)
        .expect(201);

      const validation = detailResponseSchema(customerSchema).safeParse(response.body);
      expect(validation.success).toBe(true);

      if (response.body.data && response.body.data.id_customer) {
        createdCustomerIds.push(response.body.data.id_customer);
      }
    });
  });

  // ----------------------------------------------------
  // ENDPOINTS DE ROLES (ROLES)
  // ----------------------------------------------------
  describe('Endpoints de Roles (/api/roles)', () => {
    
    test('GET /api/roles - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .get('/api/roles')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/roles - Con Token Admin - Debe retornar lista de roles y coincidir con el esquema Zod', async () => {
      const response = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const validation = listResponseSchema(roleSchema).safeParse(response.body);
      expect(validation.success).toBe(true);
    });

    test('POST /api/roles - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .post('/api/roles')
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('POST /api/roles - Con Token Admin - Debe crear un nuevo rol y coincidir con el esquema Zod', async () => {
      const newRoleData = {
        name: 'Role Integration Test',
        description: 'Descripción de prueba para rol de integración'
      };

      const response = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newRoleData)
        .expect(201);

      const validation = detailResponseSchema(roleSchema).safeParse(response.body);
      expect(validation.success).toBe(true);

      if (response.body.data && response.body.data.id_role) {
        createdRoleIds.push(response.body.data.id_role);
      }
    });
  });

  // ----------------------------------------------------
  // ENDPOINTS DE PROVEEDORES (SUPPLIERS)
  // ----------------------------------------------------
  describe('Endpoints de Proveedores (/api/suppliers)', () => {
    
    test('GET /api/suppliers - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .get('/api/suppliers')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/suppliers - Con Token Admin - Debe retornar lista de proveedores y coincidir con el esquema Zod', async () => {
      const response = await request(app)
        .get('/api/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const validation = listResponseSchema(supplierSchema).safeParse(response.body);
      expect(validation.success).toBe(true);
    });

    test('POST /api/suppliers - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .post('/api/suppliers')
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('POST /api/suppliers - Con Token Admin - Debe crear un nuevo proveedor y coincidir con el esquema Zod', async () => {
      const newSupplierData = {
        name: 'Supplier Integration Test Inc',
        tax_id: 'TAX-99988-INT',
        phone: '123-4567890',
        address: '456 Supplier Way',
        payment_terms: 'NET30'
      };

      const response = await request(app)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSupplierData)
        .expect(201);

      const validation = detailResponseSchema(supplierSchema).safeParse(response.body);
      expect(validation.success).toBe(true);

      if (response.body.data && response.body.data.id_supplier) {
        createdSupplierIds.push(response.body.data.id_supplier);
      }
    });
  });

  // ----------------------------------------------------
  // ENDPOINTS DE PLANES DE FINANCIAMIENTO (FINANCING PLANS)
  // ----------------------------------------------------
  describe('Endpoints de Planes de Financiamiento (/api/financing-plans)', () => {
    
    test('GET /api/financing-plans - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .get('/api/financing-plans')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/financing-plans - Con Token Válido - Debe retornar lista de planes y coincidir con el esquema Zod', async () => {
      const response = await request(app)
        .get('/api/financing-plans')
        .set('Authorization', `Bearer ${sellerToken}`)
        .expect(200);

      const validation = listResponseSchema(financingPlanSchema).safeParse(response.body);
      expect(validation.success).toBe(true);
    });

    test('POST /api/financing-plans - Sin Token - Debe retornar 401', async () => {
      const response = await request(app)
        .post('/api/financing-plans')
        .send({ name: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('POST /api/financing-plans - Con Token Admin - Debe crear un nuevo plan de financiamiento y coincidir con el esquema Zod', async () => {
      const newPlanData = {
        name: 'Plan Flex Integration',
        interest_rate: 5.5,
        number_installments: 24
      };

      const response = await request(app)
        .post('/api/financing-plans')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newPlanData)
        .expect(201);

      const validation = detailResponseSchema(financingPlanSchema).safeParse(response.body);
      expect(validation.success).toBe(true);

      if (response.body.data && response.body.data.id_financing_plan) {
        createdFinancingPlanIds.push(response.body.data.id_financing_plan);
      }
    });
  });

  // ----------------------------------------------------
  // ENDPOINTS DE VEHÍCULOS (VEHICLES) - PROTEGIDOS POR JWT
  // ----------------------------------------------------
  describe('Endpoints de Vehículos (/api/vehicles) - Autorización por Rol', () => {
    let testBrandId = null;
    let testModelId = null;
    let testSupplierId = null;
    let uniqueSuffix = '';

    beforeAll(async () => {
      uniqueSuffix = Date.now().toString();
      const brand = await Brand.create({
        name: `Brand Auth Test ${uniqueSuffix}`,
        description: 'Brand for vehicle auth testing',
        country_origin: 'Germany',
        website: 'https://brandauthtest.com'
      });
      testBrandId = brand.id_brand;
      createdBrandIds.push(testBrandId);

      const model = await Model.create({
        name: `Model Auth Test ${uniqueSuffix}`,
        id_brand: testBrandId,
        fuel_type: 'electric',
        transmission: 'automatic',
        body_type: 'suv'
      });
      testModelId = model.id_model;
      createdModelIds.push(testModelId);

      const supplier = await Supplier.create({
        name: `Supplier Auth Test ${uniqueSuffix}`,
        tax_id: `TX-${uniqueSuffix.slice(-6)}`,
        phone: '12345678',
        address: '123 Main St',
        payment_terms: 'NET30'
      });
      testSupplierId = supplier.id_supplier;
      createdSupplierIds.push(testSupplierId);
    });

    test('GET /api/vehicles - Sin Token - Debe retornar 401 (No autorizado)', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .expect(401);

      const validation = errorResponseSchema.safeParse(response.body);
      expect(validation.success).toBe(true);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No autorizado');
    });

    test('GET /api/vehicles - Token con Rol No Permitido (Invitado: Rol 4) - Debe retornar 403 (Prohibido)', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${guestToken}`)
        .expect(403);

      const validation = errorResponseSchema.safeParse(response.body);
      expect(validation.success).toBe(true);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No tienes permisos');
    });

    test('GET /api/vehicles - Token con Rol Permitido (Vendedor: Rol 3) - Debe retornar 200 y la lista de vehículos', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${sellerToken}`)
        .expect(200);

      const validation = listResponseSchema(vehicleSchema).safeParse(response.body);
      if (!validation.success) {
        console.error('GET /api/vehicles VALIDATION ERROR:', JSON.stringify(validation.error.format(), null, 2));
        console.error('GET /api/vehicles DATA RECEIVED:', JSON.stringify(response.body.data, null, 2));
      }
      expect(validation.success).toBe(true);
    });

    test('POST /api/vehicles - Con Rol No Autorizado para creación (Vendedor: Rol 3) - Debe retornar 403', async () => {
      const newVehicleData = {
        license_plate: `P-${uniqueSuffix.slice(-5)}`,
        id_brand: testBrandId,
        id_model: testModelId,
        id_supplier: testSupplierId,
        year: 2025,
        sale_price: 25000
      };

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${sellerToken}`)
        .send(newVehicleData)
        .expect(403);

      const validation = errorResponseSchema.safeParse(response.body);
      expect(validation.success).toBe(true);
      expect(response.body.success).toBe(false);
    });

    test('POST /api/vehicles - Con Rol Autorizado (Administrador: Rol 1) - Debe crear el vehículo exitosamente (201)', async () => {
      const newVehicle = {
        license_plate: `PL-${uniqueSuffix.slice(-5)}`,
        vehicle_serial: `VS-${uniqueSuffix.slice(-6)}`,
        engine_serial: `ES-${uniqueSuffix.slice(-6)}`,
        body_serial: `BS-${uniqueSuffix.slice(-6)}`,
        manufacture_date: new Date(),
        purchase_date: new Date(),
        mileage: 50,
        color: 'Gris',
        id_brand: testBrandId,
        id_model: testModelId,
        id_supplier: testSupplierId,
        year: 2026,
        purchase_price: 18000,
        sale_price: 22000
      };

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newVehicle);

      // Guardar ID en la lista de limpieza INMEDIATAMENTE
      if (response.body.data && response.body.data.id_vehicle) {
        createdVehicleIds.push(response.body.data.id_vehicle);
      }

      if (response.status !== 201) {
        console.error('FAILED POST /api/vehicles BODY:', response.body);
      }

      expect(response.status).toBe(201);

      const validation = detailResponseSchema(vehicleSchema).safeParse(response.body);
      if (!validation.success) {
        console.error('VEHICLE VALIDATION ERRORS:', JSON.stringify(validation.error.format(), null, 2));
        console.error('RECEIVED VEHICLE BODY:', response.body);
      }
      expect(validation.success).toBe(true);
    });
  });

  // ----------------------------------------------------
  // ENDPOINTS DE PERFIL (/api/profile y /api/profile_update)
  // ----------------------------------------------------
  describe('Endpoints de Perfil (/api/profile y /api/profile_update)', () => {
    let testUser = null;
    let testUserToken = null;

    beforeAll(async () => {
      try {
        const UserAccount = require('../src/models/user_account.js');
        // Crear un usuario de prueba en la base de datos
        testUser = await UserAccount.create({
          first_name: 'John',
          last_name: 'Doe Profile',
          email: `john.profile.${Date.now()}@test.com`,
          password: 'password123',
          status: 'active',
          id_role: 3 // Vendedor
        });
        testUserToken = generateTestToken(testUser.id_user, testUser.id_role);
      } catch (err) {
        console.error("beforeAll PROFILE ERROR:", err);
        throw err;
      }
    });

    afterAll(async () => {
      const UserAccount = require('../src/models/user_account.js');
      if (testUser) {
        await UserAccount.destroy({ where: { id_user: testUser.id_user } }).catch(() => {});
      }
    });

    test('GET /api/profile - Sin Token - Debe retornar 401 (No autorizado)', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/profile - Con Token Válido - Debe retornar 200 y los datos correctos del perfil', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${testUserToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testUser.id_user);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.nombre).toBe('John');
      expect(response.body.data.apellido).toBe('Doe Profile');
      expect(response.body.data.rol).toBe(3);
    });

    test('PUT /api/profile_update - Con Token Válido - Debe actualizar nombre y apellido', async () => {
      const updateData = {
        first_name: 'John Updated',
        last_name: 'Doe Updated'
      };

      const response = await request(app)
        .put('/api/profile_update')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nombre).toBe('John Updated');
      expect(response.body.data.apellido).toBe('Doe Updated');

      // Validar en la base de datos directamente
      const UserAccount = require('../src/models/user_account.js');
      const dbUser = await UserAccount.findByPk(testUser.id_user);
      expect(dbUser.first_name).toBe('John Updated');
      expect(dbUser.last_name).toBe('Doe Updated');
    });

    test('PUT /api/profile_update - Intentar actualizar id_role (Seguridad) - Debe ser ignorado o no cambiar el rol', async () => {
      const updateData = {
        id_role: 1, // Intentar promoverse a Admin
        status: 'inactive' // Intentar desactivarse
      };

      const response = await request(app)
        .put('/api/profile_update')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.rol).toBe(3); // Se mantiene el rol original (3)

      const UserAccount = require('../src/models/user_account.js');
      const dbUser = await UserAccount.findByPk(testUser.id_user);
      expect(dbUser.id_role).toBe(3); // No cambia en la BD
      expect(dbUser.status).toBe('active'); // No cambia en la BD
    });
  });

  // ----------------------------------------------------
  // ENDPOINTS DE AUTENTICACIÓN (/api/auth/forgot-password)
  // ----------------------------------------------------
  describe('Endpoints de Autenticación (/api/auth)', () => {
    let testUser = null;
    let sendMailSpy = null;

    beforeAll(async () => {
      const UserAccount = require('../src/models/user_account.js');
      const transporter = require('../src/config/mailer.js');
      
      // Espiar el transporter para evitar envío real de correos durante los tests
      sendMailSpy = jest.spyOn(transporter, 'sendMail').mockResolvedValue({ messageId: 'mock-id' });

      // Crear un usuario de prueba en la base de datos
      testUser = await UserAccount.create({
        first_name: 'AuthTest',
        last_name: 'User',
        email: `authtest.${Date.now()}@test.com`,
        password: 'password123',
        status: 'active',
        id_role: 3
      });
    });

    afterAll(async () => {
      const UserAccount = require('../src/models/user_account.js');
      if (testUser) {
        await UserAccount.destroy({ where: { id_user: testUser.id_user } }).catch(() => {});
      }
      if (sendMailSpy) {
        sendMailSpy.mockRestore();
      }
    });

    test('POST /api/auth/forgot-password - Usuario Inexistente - Debe retornar 400 (Error)', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent.user.test@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('No existe una cuenta asociada');
    });

    test('POST /api/auth/forgot-password - Usuario Existente - Debe retornar 200 y simular envío de email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Se ha enviado un enlace de recuperación');
      expect(sendMailSpy).toHaveBeenCalled();
    });

    test('GET /api/auth/reset-password/:token - Debe redirigir al frontend usando la IP 127.0.0.1', async () => {
      const testToken = 'some-dummy-token';
      const response = await request(app)
        .get(`/api/auth/reset-password/${testToken}`)
        .expect(301);

      expect(response.headers.location).toContain('127.0.0.1:3001');
      expect(response.headers.location).toContain(`token=${testToken}`);
    });
  });

});
