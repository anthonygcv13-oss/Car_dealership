const { Quote, Customer, Vehicle } = require('../src/models/associations.js');
const sequelize = require('../src/config/db.js');

async function check() {
  try {
    const allQuotes = await Quote.findAll();
    console.log(`Total quotes in DB: ${allQuotes.length}`);
    for (const q of allQuotes) {
      const cust = await Customer.findByPk(q.id_customer);
      const veh = await Vehicle.findByPk(q.id_vehicle);
      console.log(`Quote #${q.id_quote}: status=${q.status}, id_customer=${q.id_customer} (exists? ${!!cust}), id_vehicle=${q.id_vehicle} (exists? ${!!veh})`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

check();
