const Customer = require('../models/customer.js');

const getAllCustomers = async () => {
    return await Customer.findAll();
};

const createCustomer = async (customerData) => {
    const { first_name, last_name, document, phone, email, address } = customerData;
    return await Customer.create({
        first_name,
        last_name,
        document,
        phone,
        email,
        address
    });
};

const updateCustomer = async (id, customerData) => {
    const [updatedRows] = await Customer.update(customerData, {
        where: { id_customer: id }
    });

    if (updatedRows === 0) return null;

    return await Customer.findByPk(id);
};

const deleteCustomer = async (id) => {
    const customerToDelete = await Customer.findByPk(id);
    
    if (customerToDelete) {
        await Customer.destroy({
            where: { id_customer: id }
        });
    }
    
    return customerToDelete;
};

module.exports = { getAllCustomers, createCustomer, updateCustomer, deleteCustomer };
