const pool = require('../config/db.js');

const getAllSupplier = async () => {
  const result = await pool.query('SELECT * FROM supplier');
  return result.rows;
};

const createSupplier = async (supplierData) => {
  const { name, tax_id, phone, address, payment_terms } = supplierData;
  const query = 'INSERT INTO supplier (name, tax_id, phone, address, payment_terms) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const result = await pool.query(query, [name, tax_id, phone, address, payment_terms]);
  return result.rows[0];
};

const updateSupplier = async (id, supplierData) => {
  const { name, tax_id, phone, address, payment_terms } = supplierData;
  const query = 'UPDATE supplier SET name = $1, tax_id = $2, phone = $3, address = $4, payment_terms = $5 WHERE id_supplier = $6 RETURNING *';
  const result = await pool.query(query, [name, tax_id, phone, address, payment_terms, id]);
  return result.rows[0];
};

const deleteSupplier = async (id) => {
  const query = 'DELETE FROM supplier WHERE id_supplier = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllSupplier, createSupplier, updateSupplier, deleteSupplier };
