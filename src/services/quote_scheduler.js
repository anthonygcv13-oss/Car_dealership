const { Quote, Customer, Vehicle, Model, Brand } = require('../models/associations.js');
const notificationService = require('./notification_services.js');

function getDaysRemaining(validityDate) {
  const validity = new Date(validityDate);
  const now = new Date();
  
  // Set both dates to midnight (00:00:00) in local time to calculate day differences accurately
  const validityMidnight = new Date(validity.getFullYear(), validity.getMonth(), validity.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = validityMidnight - nowMidnight;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

async function checkAndExpireQuotes() {
  console.log('[Scheduler] Executing scheduled quote check...');
  try {
    // Fetch all quotes that are still pending
    const pendingQuotes = await Quote.findAll({
      where: { status: 'pending' },
      include: [
        { model: Customer, as: 'customer' },
        { 
          model: Vehicle, 
          as: 'vehicle',
          include: [{ model: Model, as: 'model', include: [{ model: Brand, as: 'brand' }] }] 
        }
      ]
    });

    console.log(`[Scheduler] Checking ${pendingQuotes.length} pending quotes...`);

    for (const quote of pendingQuotes) {
      const daysRemaining = getDaysRemaining(quote.validity_date);

      const customerName = quote.customer ? `${quote.customer.first_name} ${quote.customer.last_name || ''}`.trim() : 'Cliente';
      const quoteNumber = `#${quote.id_quote.toString().padStart(4, '0')}`;
      const vehicle = quote.vehicle;
      const modelName = vehicle && vehicle.model ? vehicle.model.name : 'Vehículo';
      const brandName = vehicle && vehicle.model && vehicle.model.brand ? vehicle.model.brand.name : '';
      const vehicleName = brandName ? `${brandName} ${modelName}` : modelName;

      if (daysRemaining <= 0) {
        // Expire the quote without relying on DB triggers that may reference missing columns
        await Quote.update({ status: 'expired' }, { where: { id_quote: quote.id_quote } });
        
        // Create a notification in the panel
        await notificationService.createNotification(
          'Cotización Expirada Automáticamente',
          `La cotización ${quoteNumber} para ${customerName} (${vehicleName}) ha expirado por superar la fecha de validez.`,
          'warning'
        );
        console.log(`[Scheduler] Quote ${quoteNumber} has expired.`);
      } else {
        // Quote is about to expire, notify the user
        let timeStr = `${daysRemaining} días`;
        if (daysRemaining === 1) {
          timeStr = 'mañana';
        }
        
        await notificationService.createNotification(
          'Cotización Próxima a Expirar',
          `La cotización ${quoteNumber} para ${customerName} (${vehicleName}) expira en ${timeStr}.`,
          'info'
        );
        console.log(`[Scheduler] Quote ${quoteNumber} will expire in ${daysRemaining} days.`);
      }
    }
    console.log('[Scheduler] Quote check execution completed successfully.');
  } catch (error) {
    console.error('[Scheduler] Error during quote checks:', error);
  }
}

function startQuoteScheduler() {
  console.log('[Scheduler] Initializing quote expiration scheduler (running every 24 hours)...');
  
  // Run once at server start after a brief delay
  setTimeout(() => {
    checkAndExpireQuotes();
  }, 5000);

  // Set interval to run every 24 hours
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    checkAndExpireQuotes();
  }, TWENTY_FOUR_HOURS);
}

module.exports = {
  startQuoteScheduler,
  checkAndExpireQuotes // Exported for test/direct invocation
};
