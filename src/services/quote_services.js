const { Quote, Customer, Vehicle, Model } = require('../models/associations.js');
const { Op } = require('sequelize');
const notificationService = require('./notification_services.js');

const getAllQuotes = async () => {
    return await Quote.findAll();
};

const searchQuotesPublic = async (email, document) => {
    // 1. Buscar todos los clientes que coincidan con el email (case-insensitive)
    const customers = await Customer.findAll({
        where: {
            email: {
                [Op.iLike]: email.trim()
            }
        }
    });

    if (!customers || customers.length === 0) {
        return [];
    }

    // 2. Filtrar clientes según el documento
    const matchedCustomers = customers.filter(c => {
        const docLower = (c.document || '').trim().toLowerCase();
        const searchDocLower = document.trim().toLowerCase();
        
        // Coincidir documento de identidad: exacto, o si es autogenerado ("CLI-xxxxxx")
        return docLower === searchDocLower || docLower.startsWith('cli-');
    });

    if (matchedCustomers.length === 0) {
        return [];
    }

    const customerIds = matchedCustomers.map(c => c.id_customer);

    // 3. Buscar cotizaciones de estos clientes incluyendo Vehículo y su Modelo
    const quotes = await Quote.findAll({
        where: {
            id_customer: customerIds
        },
        include: [
            {
                model: Customer,
                as: 'customer'
            },
            {
                model: Vehicle,
                as: 'vehicle',
                include: [
                    {
                        model: Model,
                        as: 'model'
                    }
                ]
            }
        ]
    });

    // 4. Mapear al formato que espera la interfaz de ConsultarReservasModal.jsx
    return quotes.map(q => {
        const customerName = q.customer ? `${q.customer.first_name} ${q.customer.last_name || ''}`.trim() : '';
        const customerEmail = q.customer ? q.customer.email : '';
        const customerDocument = q.customer ? q.customer.document : '';
        const customerPhone = q.customer ? q.customer.phone : '';

        const vehicleObj = q.vehicle;
        const modelObj = vehicleObj ? vehicleObj.model : null;

        return {
            id_quote: q.id_quote,
            modelName: modelObj ? modelObj.name : 'Modelo Premium',
            status: q.status || 'pendiente',
            date: q.date,
            year: vehicleObj ? vehicleObj.year : '',
            color: vehicleObj ? vehicleObj.color : '',
            estimated_price: q.estimated_price,
            validity_date: q.validity_date,
            customerName,
            customerEmail,
            customerDocument,
            customerPhone
        };
    });
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

module.exports = { getAllQuotes, searchQuotesPublic, createQuote, updateQuote, deleteQuote };
