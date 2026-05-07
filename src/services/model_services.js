const pool = require('../config/db.js');

const getAllModels = async () => {
  const result = await pool.query('SELECT * FROM model');
  return result.rows;
};

const createModel = async (modelData) => {
  const { name, id_brand, fuel_type, transmission, body_type } = modelData;
  const query = 'INSERT INTO model (name, id_brand, fuel_type, transmission, body_type) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const result = await pool.query(query, [name, id_brand, fuel_type, transmission, body_type]);
  return result.rows[0];
};

const updateModel = async (id, modelData) => {
  const { name, id_brand, fuel_type, transmission, body_type } = modelData;
  const query = 'UPDATE model SET name = $1, id_brand = $2, fuel_type = $3, transmission = $4, body_type = $5 WHERE id_model = $6 RETURNING *';
  const result = await pool.query(query, [name, id_brand, fuel_type, transmission, body_type, id]);
  return result.rows[0];
};

const deleteModel = async (id) => {
  const query = 'DELETE FROM model WHERE id_model = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllModels, createModel, updateModel, deleteModel };
