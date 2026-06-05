const Model = require('../models/model.js');
const Brand = require('../models/brand.js');
const Vehicle = require('../models/vehicle.js');
const VehicleImage = require('../models/vehicle_image.js');

const getAllModels = async () => {
    return await Model.findAll({
        include: [
            {
                model: Brand,
                as: 'brand',
                attributes: ['id_brand', 'name']
            },
            {
                model: Vehicle,
                as: 'vehicles',
                where: { status: 'available' },
                required: false,
                include: [
                    {
                        model: VehicleImage,
                        as: 'images',
                        required: false
                    }
                ]
            }
        ]
    });
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
