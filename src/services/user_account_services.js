const { UserAccount } = require('../models/associations.js'); // Importamos el modelo de Sequelize
const bcrypt = require('bcrypt');

// --- LEER TODOS ---
const getAllUserAccounts = async () => {
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
    const dataToUpdate = { ...userData };
    
    // Si viene la contraseña y no está vacía, la encriptamos
    if (dataToUpdate.password && dataToUpdate.password.trim() !== '') {
        const saltRounds = 10;
        dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, saltRounds);
    } else {
        // De lo contrario, quitamos la propiedad para no sobreescribir la contraseña existente
        delete dataToUpdate.password;
    }

    // .update() recibe los datos y un objeto "where" para el ID
    const [updatedRows] = await UserAccount.update(dataToUpdate, {
        where: { id_user: id }
    });

    if (updatedRows === 0) return null;

    return await UserAccount.findByPk(id, {
        include: [
            { association: 'role' }
        ]
    });
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