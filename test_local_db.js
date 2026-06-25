const { Sequelize } = require('sequelize');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');

let connectionString = '';
const lines = envContent.split('\n');
for (const line of lines) {
  if (line.trim().startsWith('DATABASE_URL_LOCAL=')) {
    connectionString = line.split('DATABASE_URL_LOCAL=')[1].trim();
    connectionString = connectionString.split('#')[0].trim();
    if (connectionString.startsWith('"') || connectionString.startsWith("'")) {
      connectionString = connectionString.slice(1, -1);
    }
  }
}

if (!connectionString) {
  console.error('DATABASE_URL_LOCAL not found!');
  process.exit(1);
}

console.log('Connecting to local database...');
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false
});

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Local database connection established successfully.');

    // Query user accounts
    console.log('\n--- User Accounts ---');
    const [users] = await sequelize.query('SELECT id_user, first_name, last_name, email, status, id_role FROM user_account');
    console.log(`Found ${users.length} users:`);
    console.log(users);

    // Query vehicle sales
    console.log('\n--- Vehicle Sales ---');
    const [sales] = await sequelize.query('SELECT * FROM vehicle_sale');
    console.log(`Found ${sales.length} sales:`);
    console.log(sales);

    // Query vehicles
    console.log('\n--- Vehicles ---');
    const [vehicles] = await sequelize.query('SELECT id_vehicle, license_plate, year, purchase_price, sale_price, status FROM vehicle');
    console.log(`Found ${vehicles.length} vehicles:`);
    if (vehicles.length > 0) {
      console.log('First 5 vehicles:', vehicles.slice(0, 5));
    }

  } catch (error) {
    console.error('Error querying local database:', error);
  } finally {
    await sequelize.close();
  }
}

run();
