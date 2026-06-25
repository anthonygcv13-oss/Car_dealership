# Autorización por Roles - API CARLIZ

## Roles del Sistema

| ID | Rol | Descripción |
|----|-----|-------------|
| 1 | **Admin** | Acceso total al sistema |
| 2 | **Vendedor** | Gestión de ventas, clientes, cotizaciones |
| 3 | **Gerente** | Supervisión y gestión de inventario |
| 4 | **Cajero** | Gestión de pagos y cuotas |
| 5 | **Soporte** | Consulta de auditoría y usuarios |

## Matriz de Permisos por Endpoint

### Marcas (`/api/brands`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar marcas | Admin, Vendedor, Gerente |
| `POST` | Crear marca | Admin, Gerente |
| `PUT` | Actualizar marca | Admin, Gerente |
| `DELETE` | Eliminar marca | Admin |

### Modelos (`/api/models`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar modelos | Admin, Vendedor, Gerente |
| `POST` | Crear modelo | Admin, Gerente |
| `PUT` | Actualizar modelo | Admin, Gerente |
| `DELETE` | Eliminar modelo | Admin |

### Proveedores (`/api/suppliers`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar proveedores | Admin, Gerente |
| `POST` | Crear proveedor | Admin, Gerente |
| `PUT` | Actualizar proveedor | Admin, Gerente |
| `DELETE` | Eliminar proveedor | Admin |

### Clientes (`/api/customers`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar clientes | Admin, Vendedor, Gerente |
| `POST` | Crear cliente | Admin, Vendedor, Gerente |
| `PUT` | Actualizar cliente | Admin, Vendedor, Gerente |
| `DELETE` | Eliminar cliente | Admin |

### Cotizaciones (`/api/quotes`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar cotizaciones | Admin, Vendedor, Gerente |
| `POST` | Crear cotización | Admin, Vendedor, Gerente |
| `PUT` | Actualizar cotización | Admin, Vendedor, Gerente |
| `DELETE` | Eliminar cotización | Admin, Gerente |

### Roles (`/api/roles`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar roles | Admin, Gerente |
| `POST` | Crear rol | Admin |
| `PUT` | Actualizar rol | Admin |
| `DELETE` | Eliminar rol | Admin |

### Planes de Financiamiento (`/api/financing-plans`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar planes | Admin, Vendedor, Gerente |
| `POST` | Crear plan | Admin, Gerente |
| `PUT` | Actualizar plan | Admin, Gerente |
| `DELETE` | Eliminar plan | Admin |

### Cuotas (`/api/installments`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar cuotas | Admin, Vendedor, Gerente, Cajero |
| `POST` | Crear cuota | Admin, Cajero |
| `PUT` | Actualizar cuota | Admin, Cajero |
| `DELETE` | Eliminar cuota | Admin |

### Usuarios (`/api/users`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar usuarios | Admin, Gerente, Soporte |
| `POST` | Crear usuario | Admin |
| `PUT` | Actualizar usuario | Admin |
| `DELETE` | Eliminar usuario | Admin |

### Vehículos (`/api/vehicles`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar vehículos | Admin, Vendedor, Gerente |
| `POST` | Crear vehículo | Admin, Gerente |
| `PUT` | Actualizar vehículo | Admin, Gerente |
| `DELETE` | Eliminar vehículo | Admin |

### Ventas (`/api/vehicle-sale`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar ventas | Admin, Vendedor, Gerente |
| `POST` | Registrar venta | Admin, Vendedor, Gerente |
| `PUT` | Actualizar venta | Admin, Vendedor, Gerente |
| `DELETE` | Anular venta | Admin, Gerente |

### Pagos (`/api/payments`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Listar pagos | Admin, Cajero |
| `POST` | Registrar pago | Admin, Cajero |

### Imágenes de Vehículos (`/api/vehicle-images`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Ver imágenes | Público |
| `POST` | Agregar imagen | Admin, Gerente |
| `PUT` | Actualizar imagen | Admin, Gerente |
| `DELETE` | Eliminar imagen | Admin |

### Auditoría (`/api/audit-logs`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Ver logs | Admin, Soporte |
| `DELETE` | Limpiar logs | Admin |

### Notificaciones (`/api/notifications`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Ver notificaciones | Cualquier usuario autenticado |
| `PUT` | Marcar como leídas | Cualquier usuario autenticado |
| `DELETE` | Eliminar notificación | Cualquier usuario autenticado |

### Perfil (`/api/profile`)

| Método | Acción | Roles Permitidos |
|--------|--------|------------------|
| `GET` | Ver perfil propio | Cualquier usuario autenticado |
| `PUT/POST` | Actualizar perfil propio | Cualquier usuario autenticado |

## Códigos de Respuesta

| Código | Significado |
|--------|-------------|
| `200` | Éxito |
| `201` | Creado exitosamente |
| `400` | Error de validación |
| `401` | No autorizado — falta token o es inválido |
| `403` | Prohibido — el rol no tiene permisos |
| `404` | Recurso no encontrado |
| `500` | Error interno del servidor |

## Uso del Middleware

```js
const authorize = require('../middleware/auth_middleware');

// Proteger con roles específicos
router.get('/', authorize([1, 2, 3]), controller.getResources);
router.post('/', authorize([1]), controller.createResource);

// Solo requiere autenticación (cualquier rol)
router.get('/', authorize(), controller.getProfile);
```
