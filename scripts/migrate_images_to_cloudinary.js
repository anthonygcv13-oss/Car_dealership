require('dotenv').config();
const { VehicleImage, BrandImage } = require('../src/models/associations.js');
const cloudinary = require('../src/config/cloudinary.js');
const sequelize = require('../src/config/db.js');

function isCloudinaryUrl(url) {
  if (!url) return false;
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
}

async function migrateImages() {
  try {
    console.log('Starting image migration to Cloudinary...');
    await sequelize.authenticate();
    console.log('Database connection successful.');

    // --- Migrate Vehicle Images ---
    console.log('\n--- Processing Vehicle Images ---');
    const vehicleImages = await VehicleImage.findAll();
    console.log(`Found ${vehicleImages.length} total vehicle images in database.`);

    let vehicleSuccessCount = 0;
    let vehicleSkipCount = 0;
    let vehicleFailCount = 0;

    for (const img of vehicleImages) {
      if (isCloudinaryUrl(img.url)) {
        console.log(`[SKIP] Vehicle Image ID ${img.id_vehicle_image} already hosted on Cloudinary: ${img.url}`);
        vehicleSkipCount++;
        continue;
      }

      console.log(`[MIGRATING] Uploading Vehicle Image ID ${img.id_vehicle_image} (URL: ${img.url})...`);
      try {
        const result = await cloudinary.uploader.upload(img.url, {
          folder: 'car-dealership/vehicles'
        });

        const newUrl = result.secure_url;
        img.url = newUrl;
        await img.save();

        console.log(`[SUCCESS] Updated Vehicle Image ID ${img.id_vehicle_image} to: ${newUrl}`);
        vehicleSuccessCount++;
      } catch (err) {
        console.error(`[ERROR] Failed to upload vehicle image ID ${img.id_vehicle_image}:`, err.message);
        vehicleFailCount++;
      }
    }

    // --- Migrate Brand Images ---
    console.log('\n--- Processing Brand Images ---');
    const brandImages = await BrandImage.findAll();
    console.log(`Found ${brandImages.length} total brand images in database.`);

    let brandSuccessCount = 0;
    let brandSkipCount = 0;
    let brandFailCount = 0;

    for (const img of brandImages) {
      if (isCloudinaryUrl(img.url)) {
        console.log(`[SKIP] Brand Image ID ${img.id_brand_image} already hosted on Cloudinary: ${img.url}`);
        brandSkipCount++;
        continue;
      }

      console.log(`[MIGRATING] Uploading Brand Image ID ${img.id_brand_image} (URL: ${img.url})...`);
      try {
        const result = await cloudinary.uploader.upload(img.url, {
          folder: 'car-dealership/brands'
        });

        const newUrl = result.secure_url;
        img.url = newUrl;
        await img.save();

        console.log(`[SUCCESS] Updated Brand Image ID ${img.id_brand_image} to: ${newUrl}`);
        brandSuccessCount++;
      } catch (err) {
        console.error(`[ERROR] Failed to upload brand image ID ${img.id_brand_image}:`, err.message);
        brandFailCount++;
      }
    }

    // --- Print Migration Summary ---
    console.log('\n======================================');
    console.log('MIGRATION SUMMARY');
    console.log('======================================');
    console.log('Vehicle Images:');
    console.log(`  - Successfully Migrated: ${vehicleSuccessCount}`);
    console.log(`  - Skipped (Already Cloudinary): ${vehicleSkipCount}`);
    console.log(`  - Failed: ${vehicleFailCount}`);
    console.log('Brand Images:');
    console.log(`  - Successfully Migrated: ${brandSuccessCount}`);
    console.log(`  - Skipped (Already Cloudinary): ${brandSkipCount}`);
    console.log(`  - Failed: ${brandFailCount}`);
    console.log('======================================');

  } catch (error) {
    console.error('Migration aborted due to database connection or general error:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

migrateImages();
