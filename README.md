# Car Dealership API

API de gestión de concesionaria desarrollada en Node.js con Express y Sequelize.

## Estructura del proyecto

- `package.json`: dependencias y scripts.
- `src/server.js`: arranque del servidor, middlewares globales, ruta base `/api`.
- `src/routes.js`: hub central de rutas que monta los routers de cada módulo.
- `src/routes/`: rutas específicas por entidad.
- `src/controllers/`: lógica de controladores para cada recurso.
- `src/models/`: modelos de datos de Sequelize.
- `src/services/`: servicios de negocio / abstracción de lógica de datos.
- `src/middleware/auth_middleware.js`: middleware de autorización y protección de rutas.
- `src/config/`: configuración de base de datos y correo.
- `src/validations/`: validadores Zod para las entradas de usuario.

## Tecnologías principales

- Node.js
- Express
- Sequelize
- PostgreSQL
- Zod
- dotenv
- bcrypt
- jsonwebtoken
- helmet
- cors
- morgan

## Punto de entrada

- `npm start` → `node src/server.js`
- `npm run dev` → `nodemon src/server.js`

## Base URL

- `http://localhost:3000/api`

## Módulos y funcionalidades

### Autenticación

- `POST /api/auth/login`: iniciar sesión.
- `POST /api/auth/forgot-password`: solicitar recuperación de contraseña.
- `POST /api/auth/reset-password/:token`: restablecer contraseña con token.

### Usuarios

- `GET /api/users`: listar cuentas de usuario.
- `POST /api/users`: crear cuenta.
- `PUT /api/users/:id`: actualizar cuenta.
- `DELETE /api/users/:id`: eliminar cuenta.

### Vehículos

- `GET /api/vehicles`: listar vehículos.
- `POST /api/vehicles`: crear vehículo.
- `PUT /api/vehicles/:id`: actualizar vehículo.
- `DELETE /api/vehicles/:id`: eliminar vehículo.

### Ventas de vehículos

- `GET /api/vehicle-sale`: listar ventas.
- `POST /api/vehicle-sale`: registrar nueva venta.
- `DELETE /api/vehicle-sale/:id`: eliminar venta.

### Proveedores

- `GET /api/suppliers`
- `POST /api/suppliers`
- `PUT /api/suppliers/:id`
- `DELETE /api/suppliers/:id`

### Roles

- `GET /api/roles`
- `POST /api/roles`
- `PUT /api/roles/:id`
- `DELETE /api/roles/:id`

### Cotizaciones

- `GET /api/quotes`
- `POST /api/quotes`
- `PUT /api/quotes/:id`
- `DELETE /api/quotes/:id`

### Pagos

- `GET /api/payments`
- `POST /api/payments`

### Modelos

- `GET /api/models`
- `POST /api/models`
- `PUT /api/models/:id`
- `DELETE /api/models/:id`

### Cuotas

- `GET /api/installments`
- `PUT /api/installments/:id`

### Planes de financiamiento

- `GET /api/financing-plans`
- `POST /api/financing-plans`
- `PUT /api/financing-plans/:id`
- `DELETE /api/financing-plans/:id`

### Clientes

- `GET /api/customers`
- `POST /api/customers`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id`

### Marcas

- `GET /api/brands`
- `POST /api/brands`
- `PUT /api/brands/:id`
- `DELETE /api/brands/:id`

### Auditoría

- `GET /api/audit-logs`
- `DELETE /api/audit-logs/:id`

## Validaciones actuales

### Validación de usuario

Definida en `src/validations/user_validation.js`.

- `first_name`: mínimo 2 caracteres.
- `email`: formato de correo válido.
- `password`: mínimo 6 caracteres.
- `status`: opcional, valor por defecto `active`.
- `id_role`: número entero positivo.

### Validación de login

Definida en `src/validations/user_validation.js`.

- `email`: formato válido.
- `password`: obligatorio.

### Validación de venta

Definida en `src/validations/sale_validation.js`.

- `date`: opcional, por defecto fecha actual.
- `final_price`: número positivo.
- `sale_type`: mínimo 3 caracteres.
- `id_user`: entero positivo.
- `id_customer`: entero positivo.
- `id_vehicle`: entero positivo.
- `id_financing_plan`: entero positivo opcional o nulo.

## Notas importantes

- El servidor usa `express.json()` para parsear JSON.
- Las rutas están protegidas con middleware de autorización usando roles numéricos.
- La mayoría de rutas CRUD están en `src/routes/` y delegan en `src/controllers/`.

## Cómo usar la colección de Postman

1. Importar `car_dealership_postman_collection.json` en Postman.
2. Configurar la variable `baseUrl` con `http://localhost:3000/api`.
3. Enviar las peticiones con los cuerpos de ejemplo.
