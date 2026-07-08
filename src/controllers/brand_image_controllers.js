const brandImageServices = require('../services/brand_image_services.js');
const { uploadBufferToCloudinary } = require('../services/cloudinary_service.js');
const { createBrandImageSchema, updateBrandImageSchema } = require('../validations/brand_image_validation.js');

const normalizeImagePayload = (body = {}) => {
    const normalized = { ...body };

    if (normalized.id_brand !== undefined && normalized.id_brand !== null) {
        normalized.id_brand = Number(normalized.id_brand);
    }

    if (normalized.display_order !== undefined && normalized.display_order !== null) {
        normalized.display_order = Number(normalized.display_order);
    }

    if (normalized.is_primary !== undefined && normalized.is_primary !== null) {
        normalized.is_primary = typeof normalized.is_primary === 'boolean'
            ? normalized.is_primary
            : normalized.is_primary === 'true' || normalized.is_primary === '1';
    }

    return normalized;
};

const getBrandImages = async (req, res) => {
    try {
        const { id_brand } = req.query;
        const filters = {};
        if (id_brand) {
            filters.id_brand = parseInt(id_brand, 10);
        }
        const data = await brandImageServices.getAllBrandImages(filters);
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getBrandImage = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await brandImageServices.getBrandImageById(id);
        if (!data) {
            return res.status(404).json({ success: false, message: "Imagen de marca no encontrada" });
        }
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const createBrandImage = async (req, res) => {
    try {
        const body = normalizeImagePayload(req.body);
        let imagePayload = body;

        if (req.file && req.file.buffer) {
            const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, 'car-dealership/brands');
            imagePayload = {
                ...body,
                url: uploadedUrl
            };
        }

        const validation = createBrandImageSchema.safeParse(imagePayload);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                errors: validation.error.issues.map(err => ({
                    campo: err.path[0],
                    mensaje: err.message
                }))
            });
        }

        const newImage = await brandImageServices.createBrandImage(validation.data);
        res.status(201).json({ success: true, data: newImage });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                success: false, 
                message: "La marca especificada no existe o el ID de referencia es inválido" 
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateBrandImage = async (req, res) => {
    try {
        const body = normalizeImagePayload(req.body);
        let imagePayload = body;

        if (req.file && req.file.buffer) {
            const uploadedUrl = await uploadBufferToCloudinary(req.file.buffer, 'car-dealership/brands');
            imagePayload = {
                ...body,
                url: uploadedUrl
            };
        }

        const validation = updateBrandImageSchema.safeParse(imagePayload);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                errors: validation.error.issues.map(err => ({
                    campo: err.path[0],
                    mensaje: err.message
                }))
            });
        }

        const updated = await brandImageServices.updateBrandImage(req.params.id, validation.data);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Imagen de marca no encontrada" });
        }
        res.json({ success: true, data: updated });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                success: false, 
                message: "La marca especificada no existe o el ID de referencia es inválido" 
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteBrandImage = async (req, res) => {
    try {
        const deleted = await brandImageServices.deleteBrandImage(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Imagen de marca no encontrada" });
        }
        res.json({ success: true, message: "Imagen de marca eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getBrandImages,
    getBrandImage,
    createBrandImage,
    updateBrandImage,
    deleteBrandImage
};
