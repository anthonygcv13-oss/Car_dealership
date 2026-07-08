const { Client } = require('pg');
const { Sequelize } = require('sequelize');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');

let connectionString = '';
const lines = envContent.split('\n');
for (const line of lines) {
  if (line.trim().startsWith('DATABASE_URL_NEON=')) {
    connectionString = line.split('DATABASE_URL_NEON=')[1].trim();
    connectionString = connectionString.split('#')[0].trim();
    if (connectionString.startsWith('"') || connectionString.startsWith("'")) {
      connectionString = connectionString.slice(1, -1);
    }
  }
}

if (!connectionString) {
  console.error('DATABASE_URL_NEON not found!');
  process.exit(1);
}

console.log('Original Connection URL:', connectionString);

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
  // Test 1: Original URL with pg client and rejectUnauthorized: false
  await testPgDirect(connectionString, { rejectUnauthorized: false });

  // Test 2: Original URL with pg client and no ssl config
  await testPgDirect(connectionString, null);

  // Test 3: Original URL with Sequelize and rejectUnauthorized: false
  await testSequelize(connectionString, { rejectUnauthorized: false });

  // Test 4: URL without query params (clean URL) and ssl rejectUnauthorized: false
  const cleanUrl = connectionString.split('?')[0];
  console.log('\nTesting with Clean URL (no query params):', cleanUrl);
  await testPgDirect(cleanUrl, { rejectUnauthorized: false });
  await testSequelize(cleanUrl, { rejectUnauthorized: false });

  // Test 5: URL without query params and ssl rejectUnauthorized: false, require: true
  await testPgDirect(cleanUrl, { require: true, rejectUnauthorized: false });
  await testSequelize(cleanUrl, { require: true, rejectUnauthorized: false });
}

runTests();
