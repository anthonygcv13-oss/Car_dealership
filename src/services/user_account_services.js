const pool = require('../config/db.js'); // Tu conexión inteligente local/neon

// --- LEER TODOS ---
const getAllUserAccounts = async () => {
    const result = await pool.query('SELECT * FROM user_account');
    return result.rows;
};

// --- CREAR (POST) ---
const createUserAccount = async (userData) => {
    const { first_name, email, password, status, id_role } = userData;
    // Usamos tus nombres de columna: first_name, email, password, status, id_role
    const query = `
        INSERT INTO user_account (first_name, email, password, status, id_role) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    
    const result = await pool.query(query, [first_name, email, password, status, id_role]);
    return result.rows[0];
};

// --- ACTUALIZAR (PUT) ---
const updateUserAccount = async (id, userData) => {
    const { first_name, email, status, id_role } = userData;
    const query = `
        UPDATE user_account 
        SET first_name = $1, email = $2, status = $3, id_role = $4 
        WHERE id_user = $5 RETURNING *`;
    
    const result = await pool.query(query, [first_name, email, status, id_role, id]);
    return result.rows[0];
};

// --- ELIMINAR (DELETE) ---
const deleteUserAccount = async (id) => {
    // Tu llave primaria es id_user
    const query = 'DELETE FROM user_account WHERE id_user = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

module.exports = {
    getAllUserAccounts,
    createUserAccount,
    updateUserAccount,
    deleteUserAccount
};