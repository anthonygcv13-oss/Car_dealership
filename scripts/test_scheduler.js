const { checkAndExpireQuotes } = require('../src/services/quote_scheduler.js');
const sequelize = require('../src/config/db.js');

async function test() {
  console.log('--- TEST: Running Quote Scheduler Checks ---');
  try {
    await checkAndExpireQuotes();
    
    // Log the notifications currently in the database to verify
    console.log('\n--- Verify Notifications in Database ---');
    const [notifications] = await sequelize.query('SELECT * FROM notification ORDER BY id_notification DESC LIMIT 10');
    console.log(`Found ${notifications.length} notifications:`);
    console.log(notifications);
  } catch (err) {
    console.error('Test run failed:', err);
  } finally {
    await sequelize.close();
  }
}

test();
