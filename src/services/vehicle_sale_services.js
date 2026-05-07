const pool = require('../config/db.js');

const getAllVehiclesale = async () => {
  const result = await pool.query('SELECT * FROM vehicle_sale');
  return result.rows;
};

const createVehiclesale = async (saleData) => {
  const { date, final_price, sale_type, id_user, id_customer, id_vehicle, id_financing_plan } = saleData;
  const query = 'INSERT INTO vehicle_sale (date, final_price, sale_type, id_user, id_customer, id_vehicle, id_financing_plan) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
  const result = await pool.query(query, [date, final_price, sale_type, id_user, id_customer, id_vehicle, id_financing_plan]);
  return result.rows[0];
};

const updateVehiclesale = async (id, saleData) => {
  const { date, final_price, sale_type, id_user, id_customer, id_vehicle, id_financing_plan } = saleData;
  const query = 'UPDATE vehicle_sale SET date = $1, final_price = $2, sale_type = $3, id_user = $4, id_customer = $5, id_vehicle = $6, id_financing_plan = $7 WHERE id_vehicle_sale = $8 RETURNING *';
  const result = await pool.query(query, [date, final_price, sale_type, id_user, id_customer, id_vehicle, id_financing_plan, id]);
  return result.rows[0];
};

const deleteVehiclesale = async (id) => {
  const query = 'DELETE FROM vehicle_sale WHERE id_vehicle_sale = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllVehiclesale, createVehiclesale, updateVehiclesale, deleteVehiclesale };
