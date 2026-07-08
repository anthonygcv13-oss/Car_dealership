const sequelize = require('./src/config/db.js');
const { UserAccount } = require('./src/models/associations.js');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Database URL resolved:', sequelize.options.dialectModule ? 'custom' : 'default');
    console.log('Connection config database:', sequelize.config.database);
    console.log('Connection config host:', sequelize.config.host);
    const users = await UserAccount.findAll();
    console.log('Users in database:', users.map(u => ({ id: u.id_user, email: u.email, status: u.status, role: u.id_role })));
  } catch (error) {
    console.error('Error during check:', error);
  } finally {
    await sequelize.close();
  }
}

check();
