const { Client } = require('pg');
require('dotenv').config();

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL_LOCAL });
  try {
    await client.connect();
    console.log('Connected to database.');

    await client.query(`ALTER TABLE user_account ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NULL;`);
    console.log('Added updated_at column if it did not exist.');

    const res = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'user_account'
      ORDER BY ordinal_position;
    `);
    console.log('user_account columns:');
    console.table(res.rows);
  } catch (err) {
    console.error('Error fixing schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
