const pool = require('../config/db.js');

const getAllQuotes = async () => {
  const result = await pool.query('SELECT * FROM quote');
  return result.rows;
};

const createQuote = async (quoteData) => {
  const { date, estimated_price, validity_date, id_vehicle, id_customer } = quoteData;
  const query = 'INSERT INTO quote (date, estimated_price, validity_date, id_vehicle, id_customer) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const result = await pool.query(query, [date, estimated_price, validity_date, id_vehicle, id_customer]);
  return result.rows[0];
};

const updateQuote = async (id, quoteData) => {
  const { date, estimated_price, validity_date, id_vehicle, id_customer } = quoteData;
  const query = 'UPDATE quote SET date = $1, estimated_price = $2, validity_date = $3, id_vehicle = $4, id_customer = $5 WHERE id_quote = $6 RETURNING *';
  const result = await pool.query(query, [date, estimated_price, validity_date, id_vehicle, id_customer, id]);
  return result.rows[0];
};

const deleteQuote = async (id) => {
  const query = 'DELETE FROM quote WHERE id_quote = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllQuotes, createQuote, updateQuote, deleteQuote };
