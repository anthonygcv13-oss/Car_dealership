const pool = require('../config/db.js');

const getAllInstallments = async () => {
  const result = await pool.query('SELECT * FROM installment');
  return result.rows;
};

const createInstallment = async (installmentData) => {
  const { number, amount, due_date, id_vehicle_sale, id_financing_plan } = installmentData;
  const query = 'INSERT INTO installment (number, amount, due_date, id_vehicle_sale, id_financing_plan) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const result = await pool.query(query, [number, amount, due_date, id_vehicle_sale, id_financing_plan]);
  return result.rows[0];
};

const updateInstallment = async (id, installmentData) => {
  const { number, amount, due_date, id_vehicle_sale, id_financing_plan } = installmentData;
  const query = 'UPDATE installment SET number = $1, amount = $2, due_date = $3, id_vehicle_sale = $4, id_financing_plan = $5 WHERE id_installment = $6 RETURNING *';
  const result = await pool.query(query, [number, amount, due_date, id_vehicle_sale, id_financing_plan, id]);
  return result.rows[0];
};

const deleteInstallment = async (id) => {
  const query = 'DELETE FROM installment WHERE id_installment = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllInstallments, createInstallment, updateInstallment, deleteInstallment };
