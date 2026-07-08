const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_drUngS8L4teF@ep-frosty-pond-aml3ih7g.c-5.us-east-1.aws.neon.tech/neondb';

async function queryCustomersAndQuotes() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('Connected to DB');
    
    console.log('\n--- CUSTOMERS ---');
    const custRes = await client.query('SELECT id_customer, first_name, last_name, email, document FROM customer LIMIT 10');
    console.log(custRes.rows);

    console.log('\n--- QUOTES ---');
    const quoteRes = await client.query('SELECT id_quote, id_customer, estimated_price, status FROM quote LIMIT 10');
    console.log(quoteRes.rows);
    
    await client.end();
  } catch (err) {
    console.error('Error querying database:', err.message);
    try { await client.end(); } catch (e) {}
  }
}

queryCustomersAndQuotes();
