const { Client } = require('pg');
require('dotenv').config();

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL_NEON
  });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'user_account'
      ORDER BY ordinal_position;
    `);
    console.log(res.rows);
    const triggers = await client.query(`
      SELECT event_manipulation, action_statement
      FROM information_schema.triggers
      WHERE event_object_table = 'user_account';
    `);
    console.log('triggers:', triggers.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
})();
