const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote_controllers.js');
const authorize = require('../middleware/auth_middleware.js');
const { quoteLimiter } = require('../middleware/rate_limiter.js');

router.get('/public-search', quoteController.publicSearchQuotes);

router.get('/', authorize([1, 2, 3]), quoteController.getQuotes);
router.post('/', quoteLimiter, quoteController.createQuote);
router.put('/:id', authorize([1, 2, 3]), quoteController.updateQuote);
router.delete('/:id', authorize([1, 3]), quoteController.deleteQuote);

module.exports = router;
