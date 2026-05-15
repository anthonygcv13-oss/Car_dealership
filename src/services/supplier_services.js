const Supplier = require('../models/supplier.js');

const getAllSupplier = async () => {
    return await Supplier.findAll();
};

const createSupplier = async (supplierData) => {
    const { name, tax_id, phone, address, payment_terms } = supplierData;
    return await Supplier.create({
        name,
        tax_id,
        phone,
        address,
        payment_terms
    });
};

const updateSupplier = async (id, supplierData) => {
    const [updatedRows] = await Supplier.update(supplierData, {
        where: { id_supplier: id }
    });

    if (updatedRows === 0) return null;

    return await Supplier.findByPk(id);
};

const deleteSupplier = async (id) => {
    const supplierToDelete = await Supplier.findByPk(id);
    
    if (supplierToDelete) {
        await Supplier.destroy({
            where: { id_supplier: id }
        });
    }
    
    return supplierToDelete;
};

module.exports = { getAllSupplier, createSupplier, updateSupplier, deleteSupplier };
