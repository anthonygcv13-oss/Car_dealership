const UserAccount = require('../models/user_account.js'); // Importamos el modelo de Sequelize
const bcrypt = require('bcrypt');

// --- LEER TODOS ---
const getAllUserAccounts = async () => {
    // Sequelize: findAll() reemplaza al "SELECT * FROM"
    return await UserAccount.findAll();
};

// --- CREAR (POST) ---
const createUserAccount = async (userData) => {
    const { first_name, email, password, status, id_role } = userData;

    // 1. Encriptación (Mantenemos Bcrypt igual)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Inserción con Sequelize: .create() reemplaza al INSERT INTO
    // Sequelize se encarga de mapear los campos automáticamente
    return await UserAccount.create({
        first_name,
        email,
        password: hashedPassword, // Guardamos la contraseña encriptada
        status,
        id_role
    });
};

// --- ACTUALIZAR (PUT) ---
const updateUserAccount = async (id, userData) => {
    // .update() recibe los datos y un objeto "where" para el ID
    const [updatedRows] = await UserAccount.update(userData, {
        where: { id_user: id }
    });

    if (updatedRows === 0) return null;

    // Retornamos el registro actualizado buscándolo por su ID
    return await UserAccount.findByPk(id);
};

// --- ELIMINAR (DELETE) ---
const deleteUserAccount = async (id) => {
    // Buscamos el usuario antes de eliminarlo para poder retornarlo (como hacía RETURNING *)
    const userToDelete = await UserAccount.findByPk(id);
    
    if (userToDelete) {
        await UserAccount.destroy({
            where: { id_user: id }
        });
    }
    
    return userToDelete;
};

module.exports = {
    getAllUserAccounts,
    createUserAccount,
    updateUserAccount,
    deleteUserAccount
};