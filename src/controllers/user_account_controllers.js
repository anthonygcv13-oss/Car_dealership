const userAccountServices = require('../services/user_account_services');

const getUserAccounts = async (req, res) => {
    try {
        const data = await userAccountServices.getAllUserAccounts();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createAccount = async (req, res) => {
    try {
        const newUser = await userAccountServices.createUserAccount(req.body);
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateAccount = async (req, res) => {
    try {
        const updated = await userAccountServices.updateUserAccount(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const deleted = await userAccountServices.deleteUserAccount(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        res.json({ success: true, message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {getUserAccounts, createAccount, updateAccount, deleteAccount };