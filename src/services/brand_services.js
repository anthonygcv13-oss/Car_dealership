const Brand = require('../models/brand.js');

const getAllBrands = async () => {
    return await Brand.findAll();
};

const createBrand = async (brandData) => {
    const { name, description, country_origin, website } = brandData;
    return await Brand.create({
        name,
        description,
        country_origin,
        website
    });
};

const updateBrand = async (id, brandData) => {
    const [updatedRows] = await Brand.update(brandData, {
        where: { id_brand: id }
    });

    if (updatedRows === 0) return null;

    return await Brand.findByPk(id);
};

const deleteBrand = async (id) => {
    const brandToDelete = await Brand.findByPk(id);
    
    if (brandToDelete) {
        await Brand.destroy({
            where: { id_brand: id }
        });
    }
    
    return brandToDelete;
};

module.exports = { getAllBrands, createBrand, updateBrand, deleteBrand };
