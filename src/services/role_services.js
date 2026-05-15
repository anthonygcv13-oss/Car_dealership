const Role = require('../models/role.js');

const getAllRoles = async () => {
    return await Role.findAll();
};

const createRole = async (roleData) => {
    const { name, description } = roleData;
    return await Role.create({
        name,
        description
    });
};

const updateRole = async (id, roleData) => {
    const [updatedRows] = await Role.update(roleData, {
        where: { id_role: id }
    });

    if (updatedRows === 0) return null;

    return await Role.findByPk(id);
};

const deleteRole = async (id) => {
    const roleToDelete = await Role.findByPk(id);
    
    if (roleToDelete) {
        await Role.destroy({
            where: { id_role: id }
        });
    }
    
    return roleToDelete;
};

module.exports = { getAllRoles, createRole, updateRole, deleteRole };
