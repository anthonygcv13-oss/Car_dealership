const { Quote } = require('../src/models/associations.js');
const { checkAndExpireQuotes } = require('../src/services/quote_scheduler.js');
const sequelize = require('../src/config/db.js');

async function testExpiration() {
  console.log('--- TEST: Simulating Expiry of Quote #2 ---');
  try {
    await sequelize.authenticate();
    
    // Set Quote #2 to 'pending' and validity_date in the past (June 1st, 2026)
    await Quote.update(
      { status: 'pending', validity_date: '2026-06-01' },
      { where: { id_quote: 2 } }
    );
    console.log('Quote #2 set to pending with validity_date = 2026-06-01 (expired).');

    // Run the scheduler checks
    await checkAndExpireQuotes();

    // Verify Quote #2's new status
    const quote = await Quote.findByPk(2);
    console.log(`\nQuote #2 status after check: ${quote.status} (expected: expired)`);

    // Verify warning notification exists
    const [notifications] = await sequelize.query(
      "SELECT * FROM notification WHERE title = 'Cotización Expirada Automáticamente' ORDER BY id_notification DESC LIMIT 1"
    );
    console.log('\nLatest expiration notification in DB:');
    console.log(notifications[0]);

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await sequelize.close();
  }
}

testExpiration();
