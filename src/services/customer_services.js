const pool = require('../config/db.js');

const getAllCustomers = async () => {
  const result = await pool.query('SELECT * FROM customer');
  return result.rows;
};

const createCustomer = async (customerData) => {
  const { first_name, last_name, document, phone, email, address } = customerData;
  const query = 'INSERT INTO customer (first_name, last_name, document, phone, email, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const result = await pool.query(query, [first_name, last_name, document, phone, email, address]);
  return result.rows[0];
};

const updateCustomer = async (id, customerData) => {
  const { first_name, last_name, document, phone, email, address } = customerData;
  const query = 'UPDATE customer SET first_name = $1, last_name = $2, document = $3, phone = $4, email = $5, address = $6 WHERE id_customer = $7 RETURNING *';
  const result = await pool.query(query, [first_name, last_name, document, phone, email, address, id]);
  return result.rows[0];
};

const deleteCustomer = async (id) => {
  const query = 'DELETE FROM customer WHERE id_customer = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllCustomers, createCustomer, updateCustomer, deleteCustomer };
