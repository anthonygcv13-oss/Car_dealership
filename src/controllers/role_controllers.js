const rolesService = require('../services/role_services.js');

const getRoles = async (req, res) => {
  try {
    const data = await rolesService.getAllRoles();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const newItem = await rolesService.createRole(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const updated = await rolesService.updateRole(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'role no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const deleted = await rolesService.deleteRole(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'role no encontrado' });
    res.json({ success: true, message: 'role eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getRoles, createRole, updateRole, deleteRole };
