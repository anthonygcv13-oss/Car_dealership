const UserAccount = require('../models/user_account.js');
const bcrypt = require('bcrypt');

const getProfile = async (userId) => {
    const user = await UserAccount.findByPk(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    return user;
};

const updateProfile = async (userId, updateData) => {
    const { first_name, last_name, email, password } = updateData;

    // Construir el objeto con los datos a actualizar
    const dataToUpdate = {};
    if (first_name !== undefined) dataToUpdate.first_name = first_name;
    if (last_name !== undefined) dataToUpdate.last_name = last_name;
    if (email !== undefined) dataToUpdate.email = email;

    if (password) {
        const saltRounds = 10;
        dataToUpdate.password = await bcrypt.hash(password, saltRounds);
    }

    // Actualizar en base de datos
    await UserAccount.update(dataToUpdate, {
        where: { id_user: userId }
    });

    // Retornar el usuario actualizado
    return await UserAccount.findByPk(userId);
};

module.exports = {
    getProfile,
    updateProfile
};
