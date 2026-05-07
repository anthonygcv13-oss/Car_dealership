const pool = require('../config/db.js');

const getAllRoles = async () => {
  const result = await pool.query('SELECT * FROM role');
  return result.rows;
};

const createRole = async (roleData) => {
  const { name, description } = roleData;
  const query = 'INSERT INTO role (name, description) VALUES ($1, $2) RETURNING *';
  const result = await pool.query(query, [name, description]);
  return result.rows[0];
};

const updateRole = async (id, roleData) => {
  const { name, description } = roleData;
  const query = 'UPDATE role SET name = $1, description = $2 WHERE id_role = $3 RETURNING *';
  const result = await pool.query(query, [name, description, id]);
  return result.rows[0];
};

const deleteRole = async (id) => {
  const query = 'DELETE FROM role WHERE id_role = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllRoles, createRole, updateRole, deleteRole };
