const Quote = require('../models/quote.js');
const Customer = require('../models/customer.js');
const Vehicle = require('../models/vehicle.js');
const Model = require('../models/model.js');
const notificationService = require('./notification_services.js');

const getAllQuotes = async () => {
    return await Quote.findAll();
};

const createQuote = async (quoteData) => {
    const { date, estimated_price, validity_date, id_vehicle, id_customer } = quoteData;
    const newQuote = await Quote.create({
        date,
        estimated_price,
        validity_date,
        id_vehicle,
        id_customer
    });

    try {
        const customer = await Customer.findByPk(id_customer);
        const vehicle = await Vehicle.findByPk(id_vehicle);
        let modelName = '';
        if (vehicle) {
            const modelObj = await Model.findByPk(vehicle.id_model);
            if (modelObj) modelName = modelObj.name;
        }

        const clientName = customer ? `${customer.first_name} ${customer.last_name}` : `ID ${id_customer}`;
        const vehicleName = modelName ? modelName : `Vehículo ID ${id_vehicle}`;
        const priceFormatted = parseFloat(estimated_price).toLocaleString('en-US');

        await notificationService.createNotification(
            'Nueva cotización recibida',
            `El cliente ${clientName} solicitó una cotización para el vehículo ${vehicleName} por $${priceFormatted} USD`,
            'info'
        );
    } catch (notifErr) {
        console.error("Error al crear notificación para la cotización:", notifErr);
    }

    return newQuote;
};

const updateQuote = async (id, quoteData) => {
    const [updatedRows] = await Quote.update(quoteData, {
        where: { id_quote: id }
    });

    if (updatedRows === 0) return null;

    return await Quote.findByPk(id);
};

const deleteQuote = async (id) => {
    const quoteToDelete = await Quote.findByPk(id);
    
    if (quoteToDelete) {
        await Quote.destroy({
            where: { id_quote: id }
        });
    }
    
    return quoteToDelete;
};

module.exports = { getAllQuotes, createQuote, updateQuote, deleteQuote };
