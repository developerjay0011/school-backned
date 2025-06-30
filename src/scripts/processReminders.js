const InvoiceReminderService = require('../services/invoiceReminderService');

async function processReminders() {
    try {
        console.log('Starting reminder processing...');
        const result = await InvoiceReminderService.processReminders();
        console.log(`Successfully processed ${result.remindersProcessed} reminders`);
        process.exit(0);
    } catch (error) {
        console.error('Error processing reminders:', error);
        process.exit(1);
    }
}

processReminders();
