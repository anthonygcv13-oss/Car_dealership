const pool = require('../config/db.js');

const getAllVehicles = async () => {
  const result = await pool.query('SELECT * FROM vehicle');
  return result.rows;
};

const createVehicle = async (vehicleData) => {
  const { license_plate, vehicle_serial, engine_serial, body_serial, manufacture_date, purchase_date, mileage, color, id_model, id_brand, year, purchase_price, sale_price, id_supplier } = vehicleData;
  const query = 'INSERT INTO vehicle (license_plate, vehicle_serial, engine_serial, body_serial, manufacture_date, purchase_date, mileage, color, id_model, id_brand, year, purchase_price, sale_price, id_supplier) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
  const result = await pool.query(query, [license_plate, vehicle_serial, engine_serial, body_serial, manufacture_date, purchase_date, mileage, color, id_model, id_brand, year, purchase_price, sale_price, id_supplier]);
  return result.rows[0];
};

const updateVehicle = async (id, vehicleData) => {
  const { license_plate, vehicle_serial, engine_serial, body_serial, manufacture_date, purchase_date, mileage, color, id_model, id_brand, year, purchase_price, sale_price, id_supplier } = vehicleData;
  const query = 'UPDATE vehicle SET license_plate = $1, vehicle_serial = $2, engine_serial = $3, body_serial = $4, manufacture_date = $5, purchase_date = $6, mileage = $7, color = $8, id_model = $9, id_brand = $10, year = $11, purchase_price = $12, sale_price = $13, id_supplier = $14 WHERE id_vehicle = $15 RETURNING *';
  const result = await pool.query(query, [license_plate, vehicle_serial, engine_serial, body_serial, manufacture_date, purchase_date, mileage, color, id_model, id_brand, year, purchase_price, sale_price, id_supplier, id]);
  return result.rows[0];
};

const deleteVehicle = async (id) => {
  const query = 'DELETE FROM vehicle WHERE id_vehicle = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllVehicles, createVehicle, updateVehicle, deleteVehicle };
