const Brand = require('../models/brand.js');
const BrandImage = require('../models/brand_image.js');
const cache = require('../config/redis.js');

const getAllBrands = async () => {
    // 1. Intentar obtener de la caché Redis
    const cachedBrands = await cache.getCache(cache.keys.BRANDS);
    if (cachedBrands) {
        console.log('⚡ [Caché Redis] Retornando lista de marcas desde la caché');
        return cachedBrands;
    }

    // 2. Si no hay caché, consultar base de datos
    const data = await Brand.findAll({
        include: [{ model: BrandImage, as: 'images' }]
    });

    // 3. Guardar en caché Redis
    await cache.setCache(cache.keys.BRANDS, data);
    return data;
};

const createBrand = async (brandData) => {
    const { name, description, country_origin, website } = brandData;
    const newBrand = await Brand.create({
        name,
        description,
        country_origin,
        website
    });

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.BRANDS);
    await cache.deleteCache(cache.keys.MODELS);
    await cache.deleteCache(cache.keys.VEHICLES);

    return newBrand;
};

const updateBrand = async (id, brandData) => {
    const [updatedRows] = await Brand.update(brandData, {
        where: { id_brand: id }
    });

    if (updatedRows === 0) return null;

    const updatedBrand = await Brand.findByPk(id);

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.BRANDS);
    await cache.deleteCache(cache.keys.MODELS);
    await cache.deleteCache(cache.keys.VEHICLES);

    return updatedBrand;
};

const deleteBrand = async (id) => {
    const brandToDelete = await Brand.findByPk(id);
    
    if (brandToDelete) {
        await Brand.destroy({
            where: { id_brand: id }
        });
    }

    // Invalidar cachés relacionadas
    await cache.deleteCache(cache.keys.BRANDS);
    await cache.deleteCache(cache.keys.MODELS);
    await cache.deleteCache(cache.keys.VEHICLES);
    
    return brandToDelete;
};

module.exports = { getAllBrands, createBrand, updateBrand, deleteBrand };
