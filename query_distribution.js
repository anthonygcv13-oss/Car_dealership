const sequelize = require('./src/config/db.js');

async function run() {
  try {
    await sequelize.authenticate();
    
    console.log('--- Vehicles by Year/Month of Purchase ---');
    const [vehiclesByMonth] = await sequelize.query(`
      SELECT TO_CHAR(purchase_date, 'YYYY-MM') as month, COUNT(*), SUM(CASE WHEN status='available' THEN 1 ELSE 0 END) as available
      FROM vehicle 
      GROUP BY month 
      ORDER BY month DESC 
      LIMIT 12
    `);
    console.log(vehiclesByMonth);

    console.log('\n--- Sales by Year/Month ---');
    const [salesByMonth] = await sequelize.query(`
      SELECT TO_CHAR(date, 'YYYY-MM') as month, COUNT(*), SUM(final_price) as total_amount
      FROM vehicle_sale
      GROUP BY month
      ORDER BY month DESC
    `);
    console.log(salesByMonth);

    console.log('\n--- Quotes by Year/Month ---');
    const [quotesByMonth] = await sequelize.query(`
      SELECT TO_CHAR(date, 'YYYY-MM') as month, COUNT(*)
      FROM quote
      GROUP BY month
      ORDER BY month DESC
    `);
    console.log(quotesByMonth);

  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

run();
