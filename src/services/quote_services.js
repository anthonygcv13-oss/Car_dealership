const { Quote, Customer, Vehicle, Model, Brand } = require('../models/associations.js');
const { Op } = require('sequelize');
const notificationService = require('./notification_services.js');
const transporter = require('../config/mailer.js');
const fs = require('fs');
const path = require('path');

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
    const { date, estimated_price, validity_date, id_vehicle, id_customer, status } = quoteData;
    
    const quoteDate = date || new Date().toISOString();
    
    // Default validity_date to 1 week from quoteDate if not specified
    let quoteValidityDate = validity_date;
    if (!quoteValidityDate) {
        const nextWeek = new Date(quoteDate);
        nextWeek.setDate(nextWeek.getDate() + 7);
        quoteValidityDate = nextWeek.toISOString().split('T')[0];
    }

    const newQuote = await Quote.create({
        date: quoteDate,
        estimated_price,
        validity_date: quoteValidityDate,
        id_vehicle,
        id_customer,
        status: status || 'pending'
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

    const updatedQuote = await Quote.findByPk(id);

    // Si la cotización fue aprobada, enviamos el correo electrónico
    if (quoteData.status === 'approved') {
        try {
            // Cargar datos completos con relaciones asociadas
            const quoteDetails = await Quote.findByPk(id, {
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
                                as: 'model',
                                include: [
                                    {
                                        model: Brand,
                                        as: 'brand'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            if (quoteDetails && quoteDetails.customer && quoteDetails.customer.email) {
                const customer = quoteDetails.customer;
                const vehicle = quoteDetails.vehicle;
                const modelObj = vehicle ? vehicle.model : null;
                const brandObj = modelObj ? modelObj.brand : null;

                const customerName = `${customer.first_name} ${customer.last_name || ''}`.trim();
                const quoteNumber = `#${quoteDetails.id_quote.toString().padStart(4, '0')}`;
                const vehicleName = brandObj && modelObj ? `${brandObj.name} ${modelObj.name}` : (modelObj ? modelObj.name : 'Vehículo Premium');
                const vehiclePlate = vehicle && vehicle.license_plate ? vehicle.license_plate : 'Sin Placa';
                const estimatedPrice = parseFloat(quoteDetails.estimated_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const quoteDate = quoteDetails.date ? new Date(quoteDetails.date).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES');
                const validityDate = quoteDetails.validity_date ? new Date(quoteDetails.validity_date).toLocaleDateString('es-ES') : '';

                // Cargar plantilla HTML
                const templatePath = path.join(__dirname, '../templates/email-quote-approved.html');
                if (fs.existsSync(templatePath)) {
                    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
                    
                    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3001';
                    
                    // Reemplazar placeholders
                    htmlTemplate = htmlTemplate.replace(/{{CUSTOMER_NAME}}/g, customerName);
                    htmlTemplate = htmlTemplate.replace(/{{QUOTE_NUMBER}}/g, quoteNumber);
                    htmlTemplate = htmlTemplate.replace(/{{VEHICLE_NAME}}/g, vehicleName);
                    htmlTemplate = htmlTemplate.replace(/{{VEHICLE_PLATE}}/g, vehiclePlate);
                    htmlTemplate = htmlTemplate.replace(/{{ESTIMATED_PRICE}}/g, estimatedPrice);
                    htmlTemplate = htmlTemplate.replace(/{{QUOTE_DATE}}/g, quoteDate);
                    htmlTemplate = htmlTemplate.replace(/{{VALIDITY_DATE}}/g, validityDate);
                    htmlTemplate = htmlTemplate.replace(/{{SITE_LINK}}/g, frontendUrl);

                    const fromAddress = process.env.EMAIL_USER || 'soporte@tudominio.com';
                    
                    await transporter.sendMail({
                        from: `"CARLIZ - Concesionaria" <${fromAddress}>`,
                        to: customer.email,
                        subject: `Cotización Aprobada ${quoteNumber} - CARLIZ`,
                        html: htmlTemplate
                    });

                    console.log(`✉️ Correo de aprobación enviado exitosamente a ${customer.email} para la cotización ${quoteNumber}`);
                } else {
                    console.error(`⚠️ No se encontró la plantilla de correo en: ${templatePath}`);
                }
            } else {
                console.warn(`⚠️ No se pudo enviar el correo: Datos de cliente o correo no disponibles para cotización ID ${id}`);
            }
        } catch (emailErr) {
            console.error("❌ Error al enviar el correo de aprobación de cotización:", emailErr);
        }
    }

    return updatedQuote;
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
