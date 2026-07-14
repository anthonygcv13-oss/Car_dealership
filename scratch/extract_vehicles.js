const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Read connection strings from .env
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    val = val.split('#')[0].trim();
    if (val.startsWith('"') || val.startsWith("'")) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
});

const localUrl = env['DATABASE_URL_LOCAL'];
const neonUrl = env['DATABASE_URL_NEON'];

// Model definitions for raw queries or dynamic models
// Since we want to ensure associations work on whichever connection we build:
function defineModels(sequelize) {
  const Brand = sequelize.define('Brand', {
    id_brand: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING },
    description: { type: Sequelize.STRING },
    country_origin: { type: Sequelize.STRING },
    website: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING }
  }, { tableName: 'brand', timestamps: false });

  const Model = sequelize.define('Model', {
    id_model: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING },
    id_brand: { type: Sequelize.INTEGER },
    description: { type: Sequelize.STRING },
    launch_year: { type: Sequelize.INTEGER },
    discontinuation_year: { type: Sequelize.INTEGER },
    fuel_type: { type: Sequelize.STRING },
    engine_displacement: { type: Sequelize.DECIMAL(5, 2) },
    transmission: { type: Sequelize.STRING },
    number_doors: { type: Sequelize.INTEGER },
    passenger_capacity: { type: Sequelize.INTEGER },
    body_type: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING }
  }, { tableName: 'model', timestamps: false });

  const Vehicle = sequelize.define('Vehicle', {
    id_vehicle: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    license_plate: { type: Sequelize.STRING },
    vehicle_serial: { type: Sequelize.STRING },
    engine_serial: { type: Sequelize.STRING },
    body_serial: { type: Sequelize.STRING },
    manufacture_date: { type: Sequelize.DATE },
    purchase_date: { type: Sequelize.DATE },
    mileage: { type: Sequelize.INTEGER },
    color: { type: Sequelize.STRING },
    id_model: { type: Sequelize.INTEGER },
    id_brand: { type: Sequelize.INTEGER },
    year: { type: Sequelize.INTEGER },
    purchase_price: { type: Sequelize.DECIMAL(10, 2) },
    sale_price: { type: Sequelize.DECIMAL(10, 2) },
    id_supplier: { type: Sequelize.INTEGER },
    status: { type: Sequelize.STRING }
  }, { tableName: 'vehicle', timestamps: false });

  Brand.hasMany(Model, { foreignKey: 'id_brand', as: 'models' });
  Model.belongsTo(Brand, { foreignKey: 'id_brand', as: 'brand' });
  Model.hasMany(Vehicle, { foreignKey: 'id_model', as: 'vehicles' });
  Vehicle.belongsTo(Model, { foreignKey: 'id_model', as: 'model' });

  return { Brand, Model, Vehicle };
}

async function tryQueryDatabase(connectionString, dbName, useSsl) {
  if (!connectionString) {
    console.log(`[${dbName}] Connection string not found, skipping.`);
    return null;
  }

  console.log(`[${dbName}] Attempting to connect...`);
  const dialectOptions = useSsl ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {};

  const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions
  });

  try {
    await sequelize.authenticate();
    console.log(`[${dbName}] Connected successfully!`);
    const { Vehicle, Model, Brand } = defineModels(sequelize);

    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: Model,
          as: 'model',
          include: [
            {
              model: Brand,
              as: 'brand'
            }
          ]
        }
      ]
    });

    console.log(`[${dbName}] Found ${vehicles.length} vehicles.`);
    await sequelize.close();
    return { success: true, dbName, vehicles };
  } catch (err) {
    console.error(`[${dbName}] Failed:`, err.message || err);
    try {
      await sequelize.close();
    } catch (_) {}
    return null;
  }
}

async function run() {
  // Try Neon
  let result = await tryQueryDatabase(neonUrl, 'Neon (Nube)', true);
  
  // Try local if Neon failed or returned no data (or just as fallback)
  if (!result) {
    console.log('Neon failed. Falling back to local database...');
    result = await tryQueryDatabase(localUrl, 'PostgreSQL Local', false);
  }

  if (!result) {
    console.error('Could not connect to either database.');
    process.exit(1);
  }

  const { dbName, vehicles } = result;

  let md = `# Listado de Vehículos\n\n`;
  md += `Este documento contiene una copia de todos los vehículos registrados en la base de datos, con sus correspondientes datos de modelos y marcas. *Extracción realizada el ${new Date().toLocaleString()}*\n\n`;
  md += `> **Fuente de datos:** Base de datos **${dbName}**\n`;
  md += `> **Cantidad total:** ${vehicles.length} vehículos\n\n`;
  md += `---\n\n`;

  if (vehicles.length === 0) {
    md += `*No se encontraron vehículos en la base de datos.*\n`;
  } else {
    vehicles.forEach((v, index) => {
      const vehicleData = v.toJSON();
      const modelData = vehicleData.model || {};
      const brandData = modelData.brand || {};

      md += `## ${index + 1}. ${brandData.name || 'Sin Marca'} ${modelData.name || 'Sin Modelo'} (${v.year || 'Año N/D'})\n\n`;
      
      md += `### Datos del Vehículo\n`;
      md += `- **ID Vehículo:** ${v.id_vehicle}\n`;
      md += `- **Matrícula / Placa:** ${v.license_plate || 'N/D'}\n`;
      md += `- **Serial del Vehículo (VIN):** ${v.vehicle_serial || 'N/D'}\n`;
      md += `- **Serial del Motor:** ${v.engine_serial || 'N/D'}\n`;
      md += `- **Serial de Carrocería:** ${v.body_serial || 'N/D'}\n`;
      md += `- **Año:** ${v.year || 'N/D'}\n`;
      md += `- **Color:** ${v.color || 'N/D'}\n`;
      md += `- **Kilometraje:** ${v.mileage !== null && v.mileage !== undefined ? v.mileage.toLocaleString() + ' km' : 'N/D'}\n`;
      md += `- **Fecha de Compra:** ${v.purchase_date ? new Date(v.purchase_date).toLocaleDateString() : 'N/D'}\n`;
      md += `- **Fecha de Fabricación:** ${v.manufacture_date ? new Date(v.manufacture_date).toLocaleDateString() : 'N/D'}\n`;
      md += `- **Precio de Compra:** ${v.purchase_price ? '$' + parseFloat(v.purchase_price).toLocaleString('es-ES', { minimumFractionDigits: 2 }) : 'N/D'}\n`;
      md += `- **Precio de Venta:** ${v.sale_price ? '$' + parseFloat(v.sale_price).toLocaleString('es-ES', { minimumFractionDigits: 2 }) : 'N/D'}\n`;
      md += `- **Estado actual:** ${v.status || 'N/D'}\n\n`;

      md += `### Datos del Modelo\n`;
      if (vehicleData.model) {
        md += `- **Nombre del Modelo:** ${modelData.name || 'N/D'}\n`;
        md += `- **Descripción:** ${modelData.description || 'Sin descripción'}\n`;
        md += `- **Año de Lanzamiento:** ${modelData.launch_year || 'N/D'}\n`;
        md += `- **Año de Discontinuación:** ${modelData.discontinuation_year || 'Activo / N/D'}\n`;
        md += `- **Tipo de Combustible:** ${modelData.fuel_type || 'N/D'}\n`;
        md += `- **Cilindrada (Motor):** ${modelData.engine_displacement ? modelData.engine_displacement + ' L' : 'N/D'}\n`;
        md += `- **Transmisión:** ${modelData.transmission || 'N/D'}\n`;
        md += `- **Número de Puertas:** ${modelData.number_doors || 'N/D'}\n`;
        md += `- **Capacidad de Pasajeros:** ${modelData.passenger_capacity || 'N/D'}\n`;
        md += `- **Tipo de Carrocería:** ${modelData.body_type || 'N/D'}\n`;
        md += `- **Estado de Producción:** ${modelData.status || 'N/D'}\n\n`;
      } else {
        md += `*No hay información del modelo asociada.*\n\n`;
      }

      md += `### Datos de la Marca\n`;
      if (modelData.brand) {
        md += `- **Nombre de la Marca:** ${brandData.name || 'N/D'}\n`;
        md += `- **País de Origen:** ${brandData.country_origin || 'N/D'}\n`;
        md += `- **Descripción de Marca:** ${brandData.description || 'Sin descripción'}\n`;
        md += `- **Sitio Web:** ${brandData.website || 'N/D'}\n`;
        md += `- **Estado:** ${brandData.status || 'N/D'}\n`;
      } else {
        md += `*No hay información de la marca asociada.*\n`;
      }

      md += `\n---\n\n`;
    });
  }

  const outputPath = path.join(__dirname, '../listado_vehiculos_completo.md');
  fs.writeFileSync(outputPath, md, 'utf8');
  console.log(`Markdown report written to: ${outputPath}`);
}

run();
