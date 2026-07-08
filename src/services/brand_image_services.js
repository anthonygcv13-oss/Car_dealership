const BrandImage = require('../models/brand_image.js');

const getAllBrandImages = async (filters = {}) => {
    const where = {};
    if (filters.id_brand) {
        where.id_brand = filters.id_brand;
    }
    return await BrandImage.findAll({
        where,
        order: [
            ['display_order', 'ASC'],
            ['id_brand_image', 'ASC']
        ]
    });
};

const getBrandImageById = async (id) => {
    return await BrandImage.findByPk(id);
};

const createBrandImage = async (imageData) => {
    const { id_brand, url, is_primary, display_order } = imageData;
    return await BrandImage.create({
        id_brand,
        url,
        is_primary,
        display_order
    });
};

const updateBrandImage = async (id, imageData) => {
    const [updatedRows] = await BrandImage.update(imageData, {
        where: { id_brand_image: id }
    });

    if (updatedRows === 0) return null;

    return await BrandImage.findByPk(id);
};

const deleteBrandImage = async (id) => {
    const imageToDelete = await BrandImage.findByPk(id);
    
    if (imageToDelete) {
        await BrandImage.destroy({
            where: { id_brand_image: id }
        });
    }
    
    return imageToDelete;
};

module.exports = {
    getAllBrandImages,
    getBrandImageById,
    createBrandImage,
    updateBrandImage,
    deleteBrandImage
};
