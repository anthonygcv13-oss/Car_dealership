const { Client } = require('pg');
require('dotenv').config();
(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL_LOCAL });
  try {
    await client.connect();
    const triggers = await client.query(`SELECT trigger_name, event_manipulation, event_object_table, action_statement FROM information_schema.triggers WHERE event_object_schema = 'public' AND event_object_table = 'user_account';`);
    console.log('triggers:', triggers.rows);
    const func = await client.query(`SELECT pg_get_functiondef(p.oid) AS definition FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE p.proname = 'update_timestamp';`);
    console.log('func:', func.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
})();
