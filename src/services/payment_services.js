const pool = require('../config/db.js');

const getAllPayments = async () => {
  const result = await pool.query('SELECT * FROM payment');
  return result.rows;
};

const createPayment = async (paymentData) => {
  const { date, amount, payment_method, id_user, id_vehicle_sale, id_installment } = paymentData;
  const query = 'INSERT INTO payment (date, amount, payment_method, id_user, id_vehicle_sale, id_installment) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const result = await pool.query(query, [date, amount, payment_method, id_user, id_vehicle_sale, id_installment]);
  return result.rows[0];
};

const updatePayment = async (id, paymentData) => {
  const { date, amount, payment_method, id_user, id_vehicle_sale, id_installment } = paymentData;
  const query = 'UPDATE payment SET date = $1, amount = $2, payment_method = $3, id_user = $4, id_vehicle_sale = $5, id_installment = $6 WHERE id_payment = $7 RETURNING *';
  const result = await pool.query(query, [date, amount, payment_method, id_user, id_vehicle_sale, id_installment, id]);
  return result.rows[0];
};

const deletePayment = async (id) => {
  const query = 'DELETE FROM payment WHERE id_payment = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllPayments, createPayment, updatePayment, deletePayment };
