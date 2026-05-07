const quotesService = require('../services/quote_services.js');

const getQuotes = async (req, res) => {
  try {
    const data = await quotesService.getAllQuotes();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createQuote = async (req, res) => {
  try {
    const newItem = await quotesService.createQuote(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateQuote = async (req, res) => {
  try {
    const updated = await quotesService.updateQuote(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'quote no encontrado' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const deleted = await quotesService.deleteQuote(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'quote no encontrado' });
    res.json({ success: true, message: 'quote eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getQuotes, createQuote, updateQuote, deleteQuote };
