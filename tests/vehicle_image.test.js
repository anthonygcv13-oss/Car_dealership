const request = require('supertest');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const app = require('../src/app.js');
const sequelize = require('../src/config/db.js');

// Importamos los modelos
const Brand = require('../src/models/brand.js');
const Model = require('../src/models/model.js');
const Supplier = require('../src/models/supplier.js');
const Vehicle = require('../src/models/vehicle.js');
const VehicleImage = require('../src/models/vehicle_image.js');

// Listas para limpieza
let testBrandId = null;
let testModelId = null;
let testSupplierId = null;
let testVehicleId = null;
const createdImageIds = [];

// Generación de tokens
const tokenSecret = process.env.JWT_SECRET || 'secret_key_temporal';
const generateTestToken = (userId, roleId) => {
  return jwt.sign({ id: userId, role: roleId }, tokenSecret, { expiresIn: '1h' });
};

const adminToken = generateTestToken(101, 1);    // Rol 1: Admin
const sellerToken = generateTestToken(103, 2);   // Rol 2: Vendedor (Seller)
const managerToken = generateTestToken(102, 3);  // Rol 3: Gerente (Manager)
const guestToken = generateTestToken(104, 5);    // Rol 5: Soporte (Guest)

// Esquemas de validación Zod para respuestas
const vehicleImageSchema = z.object({
  id_vehicle_image: z.number().int(),
  id_vehicle: z.number().int(),
  url: z.string(),
  is_primary: z.boolean(),
  display_order: z.number().int()
});

const listResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(vehicleImageSchema)
});

const detailResponseSchema = z.object({
  success: z.literal(true),
  data: vehicleImageSchema
});

describe('Pruebas de Integración - Endpoints de Imágenes de Vehículos (/api/vehicle-images)', () => {

  beforeAll(async () => {
    // Sincronizar modelos
    const Notification = require('../src/models/notification.js');
    await Notification.sync();

    // 1. Crear marca temporal
    const brand = await Brand.create({
      name: `Brand Image Test ${Date.now()}`,
      description: 'Brand for vehicle image testing',
      country_origin: 'Japan',
      website: 'https://brandimagetest.com'
    });
    testBrandId = brand.id_brand;

    // 2. Crear modelo temporal
    const model = await Model.create({
      name: `Model Image Test ${Date.now()}`,
      id_brand: testBrandId,
      fuel_type: 'gasoline',
      transmission: 'manual',
      body_type: 'sedan'
    });
    testModelId = model.id_model;

    // 3. Crear proveedor temporal
    const supplier = await Supplier.create({
      name: `Supplier Image Test ${Date.now()}`,
      tax_id: `TAX-${Date.now().toString().slice(-6)}`,
      phone: '999888777',
      address: 'Test supplier address',
      payment_terms: 'NET30'
    });
    testSupplierId = supplier.id_supplier;

    // 4. Crear vehículo temporal
    const vehicle = await Vehicle.create({
      license_plate: `IMG-${Date.now().toString().slice(-5)}`,
      vehicle_serial: `VS-${Date.now().toString().slice(-6)}`,
      engine_serial: `ES-${Date.now().toString().slice(-6)}`,
      body_serial: `BS-${Date.now().toString().slice(-6)}`,
      manufacture_date: new Date(),
      purchase_date: new Date(),
      mileage: 0,
      color: 'Negro',
      id_brand: testBrandId,
      id_model: testModelId,
      id_supplier: testSupplierId,
      year: 2026,
      purchase_price: 15000,
      sale_price: 18000,
      status: 'available'
    });
    testVehicleId = vehicle.id_vehicle;
  });

  afterAll(async () => {
    // Eliminar imágenes creadas
    for (const id of createdImageIds) {
      await VehicleImage.destroy({ where: { id_vehicle_image: id } }).catch(() => {});
    }

    // Eliminar vehículo
    if (testVehicleId) {
      await Vehicle.destroy({ where: { id_vehicle: testVehicleId } }).catch(() => {});
    }

    // Eliminar proveedor
    if (testSupplierId) {
      await Supplier.destroy({ where: { id_supplier: testSupplierId } }).catch(() => {});
    }

    // Eliminar modelo
    if (testModelId) {
      await Model.destroy({ where: { id_model: testModelId } }).catch(() => {});
    }

    // Eliminar marca
    if (testBrandId) {
      await Brand.destroy({ where: { id_brand: testBrandId } }).catch(() => {});
    }

    await sequelize.close();
  });

  // --- GET ALL IMAGES ---
  test('GET /api/vehicle-images - Debe retornar la lista de todas las imágenes (Público)', async () => {
    const response = await request(app)
      .get('/api/vehicle-images')
      .expect(200);

    const validation = listResponseSchema.safeParse(response.body);
    expect(validation.success).toBe(true);
  });

  // --- POST / CREATE IMAGE ---
  test('POST /api/vehicle-images - Sin Token - Debe retornar 401', async () => {
    const newImage = {
      id_vehicle: testVehicleId,
      url: 'https://example.com/images/car.jpg',
      is_primary: true
    };

    const response = await request(app)
      .post('/api/vehicle-images')
      .send(newImage)
      .expect(401);

    expect(response.body.success).toBe(false);
  });

  test('POST /api/vehicle-images - Token sin permisos (Rol 3 / Vendedor) - Debe retornar 403', async () => {
    const newImage = {
      id_vehicle: testVehicleId,
      url: 'https://example.com/images/car.jpg',
      is_primary: true
    };

    const response = await request(app)
      .post('/api/vehicle-images')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(newImage)
      .expect(403);

    expect(response.body.success).toBe(false);
  });

  test('POST /api/vehicle-images - Con validación fallida (Falta URL) - Debe retornar 400', async () => {
    const newImage = {
      id_vehicle: testVehicleId,
      is_primary: true
    };

    const response = await request(app)
      .post('/api/vehicle-images')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newImage)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Error de validación');
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].campo).toBe('url');
  });

  test('POST /api/vehicle-images - Vehículo inexistente - Debe retornar 400 (Violación FK)', async () => {
    const newImage = {
      id_vehicle: 999999, // Inexistente
      url: 'https://example.com/images/non-existent.jpg',
      is_primary: true
    };

    const response = await request(app)
      .post('/api/vehicle-images')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newImage)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('no existe');
  });

  test('POST /api/vehicle-images - Datos correctos con Admin - Debe crear la imagen (201)', async () => {
    const newImage = {
      id_vehicle: testVehicleId,
      url: 'https://example.com/images/car1.jpg',
      is_primary: true,
      display_order: 1
    };

    const response = await request(app)
      .post('/api/vehicle-images')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newImage)
      .expect(201);

    expect(response.body.success).toBe(true);
    const validation = detailResponseSchema.safeParse(response.body);
    expect(validation.success).toBe(true);

    if (response.body.data && response.body.data.id_vehicle_image) {
      createdImageIds.push(response.body.data.id_vehicle_image);
    }
  });

  // --- GET IMAGES BY VEHICLE ---
  test('GET /api/vehicle-images?id_vehicle=X - Debe retornar imágenes filtradas por vehículo', async () => {
    const response = await request(app)
      .get(`/api/vehicle-images?id_vehicle=${testVehicleId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].id_vehicle).toBe(testVehicleId);
  });

  // --- GET SINGLE IMAGE BY ID ---
  test('GET /api/vehicle-images/:id - Debe retornar la imagen correspondiente', async () => {
    const targetId = createdImageIds[0];
    const response = await request(app)
      .get(`/api/vehicle-images/${targetId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id_vehicle_image).toBe(targetId);
  });

  test('GET /api/vehicle-images/:id - Inexistente - Debe retornar 404', async () => {
    const response = await request(app)
      .get('/api/vehicle-images/999999')
      .expect(404);

    expect(response.body.success).toBe(false);
  });

  // --- PUT / UPDATE IMAGE ---
  test('PUT /api/vehicle-images/:id - Modificar URL y orden - Debe actualizar exitosamente (200)', async () => {
    const targetId = createdImageIds[0];
    const updateData = {
      url: 'https://example.com/images/car1_updated.jpg',
      display_order: 10
    };

    const response = await request(app)
      .put(`/api/vehicle-images/${targetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.url).toBe(updateData.url);
    expect(response.body.data.display_order).toBe(updateData.display_order);
  });

  // --- DELETE IMAGE ---
  test('DELETE /api/vehicle-images/:id - Rol Manager - Debe retornar 403 (Solo Admin)', async () => {
    const targetId = createdImageIds[0];
    const response = await request(app)
      .delete(`/api/vehicle-images/${targetId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .expect(403);

    expect(response.body.success).toBe(false);
  });

  test('DELETE /api/vehicle-images/:id - Rol Admin - Debe eliminar la imagen (200)', async () => {
    const targetId = createdImageIds[0];
    const response = await request(app)
      .delete(`/api/vehicle-images/${targetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('eliminada correctamente');

    // Verificar que ya no exista
    await request(app)
      .get(`/api/vehicle-images/${targetId}`)
      .expect(404);
  });

});
