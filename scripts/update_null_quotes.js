const sequelize = require('../src/config/db.js');

async function updateNullQuotes() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Updating quotes with null status to "pending"...');
    const [result, metadata] = await sequelize.query(
      "UPDATE quote SET status = 'pending' WHERE status IS NULL"
    );
    
    console.log('Update completed successfully.');
  } catch (error) {
    console.error('Error updating quotes:', error);
  } finally {
    await sequelize.close();
  }
}

updateNullQuotes();
