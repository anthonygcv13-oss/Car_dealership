const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL_NEON;

if (!connectionString) {
  console.error('DATABASE_URL_NEON not found!');
  process.exit(1);
}

console.log('Connecting to Neon database to inspect images...');
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Query vehicle images
    const [vehicleImages] = await sequelize.query('SELECT id_vehicle_image, id_vehicle, url FROM vehicle_image');
    console.log(`Found ${vehicleImages.length} vehicle images:`);
    vehicleImages.forEach(img => {
      console.log(`- Vehicle ID ${img.id_vehicle} (Image ID ${img.id_vehicle_image}): ${img.url}`);
    });

    // Query brand images
    const [brandImages] = await sequelize.query('SELECT id_brand_image, id_brand, url FROM brand_image');
    console.log(`\nFound ${brandImages.length} brand images:`);
    brandImages.forEach(img => {
      console.log(`- Brand ID ${img.id_brand} (Image ID ${img.id_brand_image}): ${img.url}`);
    });

  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await sequelize.close();
  }
}

run();
