const sequelize = require('./src/config/db.js');

async function run() {
  try {
    await sequelize.authenticate();
    const [columns] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customer'");
    console.log('Customer columns:', columns);
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

run();
