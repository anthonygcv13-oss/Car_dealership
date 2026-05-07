const pool = require('../config/db.js');

const getAllFinancingPlans = async () => {
  const result = await pool.query('SELECT * FROM financing_plan');
  return result.rows;
};

const createFinancingPlan = async (planData) => {
  const { name, interest_rate, number_installments } = planData;
  const query = 'INSERT INTO financing_plan (name, interest_rate, number_installments) VALUES ($1, $2, $3) RETURNING *';
  const result = await pool.query(query, [name, interest_rate, number_installments]);
  return result.rows[0];
};

const updateFinancingPlan = async (id, planData) => {
  const { name, interest_rate, number_installments } = planData;
  const query = 'UPDATE financing_plan SET name = $1, interest_rate = $2, number_installments = $3 WHERE id_financing_plan = $4 RETURNING *';
  const result = await pool.query(query, [name, interest_rate, number_installments, id]);
  return result.rows[0];
};

const deleteFinancingPlan = async (id) => {
  const query = 'DELETE FROM financing_plan WHERE id_financing_plan = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllFinancingPlans, createFinancingPlan, updateFinancingPlan, deleteFinancingPlan };
