const pool = require('../config/db.js');

const getAllBrands = async () => {
  const result = await pool.query('SELECT * FROM brand');
  return result.rows;
};

const createBrand = async (brandData) => {
  const { name, description, country_origin, website } = brandData;
  const query = 'INSERT INTO brand (name, description, country_origin, website) VALUES ($1, $2, $3, $4) RETURNING *';
  const result = await pool.query(query, [name, description, country_origin, website]);
  return result.rows[0];
};

const updateBrand = async (id, brandData) => {
  const { name, description, country_origin, website } = brandData;
  const query = 'UPDATE brand SET name = $1, description = $2, country_origin = $3, website = $4 WHERE id_brand = $5 RETURNING *';
  const result = await pool.query(query, [name, description, country_origin, website, id]);
  return result.rows[0];
};

const deleteBrand = async (id) => {
  const query = 'DELETE FROM brand WHERE id_brand = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllBrands, createBrand, updateBrand, deleteBrand };
