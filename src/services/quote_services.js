const Quote = require('../models/quote.js');

const getAllQuotes = async () => {
    return await Quote.findAll();
};

const createQuote = async (quoteData) => {
    const { date, estimated_price, validity_date, id_vehicle, id_customer } = quoteData;
    return await Quote.create({
        date,
        estimated_price,
        validity_date,
        id_vehicle,
        id_customer
    });
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
