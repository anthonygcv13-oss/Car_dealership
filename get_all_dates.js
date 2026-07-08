const sequelize = require('./src/config/db.js');
const { VehicleSale, Customer, Vehicle, Quote } = require('./src/models/associations.js');

async function run() {
  try {
    await sequelize.authenticate();
    
    const sales = await VehicleSale.findAll();
    console.log('--- Sales Dates ---');
    sales.forEach(s => console.log(`ID: ${s.id_vehicle_sale}, Date: ${s.date}, Price: ${s.final_price}, CreatedAt: ${s.created_at}`));

    const customers = await Customer.findAll();
    console.log('\n--- Customers Dates ---');
    customers.forEach(c => console.log(`ID: ${c.id_customer}, CreatedAt: ${c.created_at}`));

    const vehicles = await Vehicle.findAll();
    console.log('\n--- Vehicles Dates ---');
    console.log(`Total: ${vehicles.length}`);
    vehicles.slice(0, 10).forEach(v => console.log(`ID: ${v.id_vehicle}, Status: ${v.status}, CreatedAt: ${v.created_at}, PurchaseDate: ${v.purchase_date}`));

    const quotes = await Quote.findAll();
    console.log('\n--- Quotes Dates ---');
    quotes.forEach(q => console.log(`ID: ${q.id_quote}, Date: ${q.date}, Status: ${q.status}, CreatedAt: ${q.created_at}`));

  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

run();
