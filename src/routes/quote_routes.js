const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote_controllers.js');

router.get('/', quoteController.getQuotes);
router.post('/', quoteController.createQuote);
router.put('/:id', quoteController.updateQuote);
router.delete('/:id', quoteController.deleteQuote);

module.exports = router;
