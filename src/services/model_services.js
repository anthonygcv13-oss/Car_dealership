const Model = require('../models/model.js');

const getAllModels = async () => {
    return await Model.findAll();
};

const createModel = async (modelData) => {
    const { name, id_brand, fuel_type, transmission, body_type } = modelData;
    return await Model.create({
        name,
        id_brand,
        fuel_type,
        transmission,
        body_type
    });
};

const updateModel = async (id, modelData) => {
    const [updatedRows] = await Model.update(modelData, {
        where: { id_model: id }
    });

    if (updatedRows === 0) return null;

    return await Model.findByPk(id);
};

const deleteModel = async (id) => {
    const modelToDelete = await Model.findByPk(id);
    
    if (modelToDelete) {
        await Model.destroy({
            where: { id_model: id }
        });
    }
    
    return modelToDelete;
};

module.exports = { getAllModels, createModel, updateModel, deleteModel };
