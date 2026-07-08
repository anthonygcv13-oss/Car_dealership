const { Client } = require('pg');
const { Sequelize } = require('sequelize');

// Replace -pooler with empty string to get direct endpoint
const connectionString = 'postgresql://neondb_owner:npg_drUngS8L4teF@ep-frosty-pond-aml3ih7g.c-5.us-east-1.aws.neon.tech/neondb';

console.log('Testing direct connection URL:', connectionString);

async function testPgDirect(url, sslConfig) {
  console.log(`\n--- Testing pg Client with SSL: ${JSON.stringify(sslConfig)} ---`);
  const client = new Client({
    connectionString: url,
    ssl: sslConfig
  });
  try {
    await client.connect();
    console.log('pg Client connected successfully!');
    const res = await client.query('SELECT version()');
    console.log('Version:', res.rows[0].version);
    await client.end();
    return true;
  } catch (err) {
    console.error('pg Client connection failed:', err.message);
    try { await client.end(); } catch (e) {}
    return false;
  }
}

async function testSequelize(url, sslConfig) {
  console.log(`\n--- Testing Sequelize with SSL: ${JSON.stringify(sslConfig)} ---`);
  const sequelize = new Sequelize(url, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: sslConfig
    }
  });
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected successfully!');
    await sequelize.close();
    return true;
  } catch (err) {
    console.error('Sequelize connection failed:', err.message);
    try { await sequelize.close(); } catch (e) {}
    return false;
  }
}

async function runTests() {
  await testPgDirect(connectionString, { rejectUnauthorized: false });
  await testSequelize(connectionString, { rejectUnauthorized: false });
  await testSequelize(connectionString, { require: true, rejectUnauthorized: false });
}

runTests();
