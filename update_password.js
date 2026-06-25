const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
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
    console.log('Database connection established.');

    const [users] = await sequelize.query("SELECT id_user, email, password FROM user_account WHERE email = 'anthonygcv13@gmail.com'");
    if (users.length === 0) {
      console.log('User not found!');
      return;
    }
    
    const user = users[0];
    console.log('Original Password Hash:', user.password);

    const newHash = await bcrypt.hash('1234', 10);
    await sequelize.query(`UPDATE user_account SET password = :newHash WHERE id_user = :userId`, {
      replacements: { newHash, userId: user.id_user }
    });
    console.log('Password successfully updated to "1234" (hash:', newHash, ')');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

run();
