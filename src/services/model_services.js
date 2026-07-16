const { Model, Brand, Vehicle, VehicleImage, VehicleVideo } = require('../models/associations.js');
const cache = require('../config/redis.js');

const getAllModels = async () => {
    // 1. Intentar obtener de la caché Redis
    const cachedModels = await cache.getCache(cache.keys.MODELS);
    if (cachedModels) {
        console.log('⚡ [Caché Redis] Retornando lista de modelos desde la caché');
        return cachedModels;
    }

    // 2. Si no hay caché, consultar base de datos
    const data = await Model.findAll({
        include: [
            {
                model: Brand,
                as: 'brand'
            },
            {
                model: Vehicle,
                as: 'vehicles',
                include: [
                    {
                        model: VehicleImage,
                        as: 'images'
                    },
                    {
                        model: VehicleVideo,
                        as: 'videos'
                    }
                ]
            }
        ]
    });

    // 3. Guardar en caché Redis
    await cache.setCache(cache.keys.MODELS, data);
    return data;
};

const createModel = async (modelData) => {
    const { name, id_brand, fuel_type, transmission, body_type } = modelData;
    const newModel = await Model.create({
        name,
        id_brand,
        fuel_type,
        transmission,
        body_type
    });

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.MODELS);
    await cache.deleteCache(cache.keys.VEHICLES);

    return newModel;
};

const updateModel = async (id, modelData) => {
    const [updatedRows] = await Model.update(modelData, {
        where: { id_model: id }
    });

    if (updatedRows === 0) return null;

    const updatedModel = await Model.findByPk(id);

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.MODELS);
    await cache.deleteCache(cache.keys.VEHICLES);

    return updatedModel;
};

const deleteModel = async (id) => {
    const modelToDelete = await Model.findByPk(id);
    
    if (modelToDelete) {
        await Model.destroy({
            where: { id_model: id }
        });
    }

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.MODELS);
    await cache.deleteCache(cache.keys.VEHICLES);
    
    return modelToDelete;
};

module.exports = { getAllModels, createModel, updateModel, deleteModel };
