const { DateTime } = require('luxon');

class DateTimeUtils {
    static getBerlinDateTime() {
        // Create in system timezone then convert to Berlin
        const now = DateTime.local();
        console.log('Local time:', now.toString());
        const berlin = now.setZone('Europe/Berlin');
        console.log('Berlin time:', berlin.toString());
        return berlin;
    }

    static formatToSQLDate(dateTime) {
        // Ensure we're in Berlin timezone
        const berlin = dateTime.setZone('Europe/Berlin');
        return berlin.toFormat('yyyy-MM-dd');
    }

    static formatToSQLDateTime(dateTime) {
        // Ensure we're in Berlin timezone
        const berlin = dateTime.setZone('Europe/Berlin');
        return berlin.toFormat('yyyy-MM-dd HH:mm:ss');
    }

    static getHourMinutes(dateTime) {
        // Convert to Berlin time and get hours/minutes
        const berlin = dateTime.setZone('Europe/Berlin');
        console.log('System time:', DateTime.local().toString());
        console.log('Input time:', dateTime.toString());
        console.log('Berlin time:', berlin.toString());
        return {
            hours: berlin.hour,
            minutes: berlin.minute,
            totalMinutes: berlin.hour * 60 + berlin.minute
        };
    }

    static parseToDateTime(dateStr, format = 'yyyy-MM-dd') {
        // Parse date string assuming it's in Berlin timezone
        return DateTime.fromFormat(dateStr, format, { zone: 'Europe/Berlin' });
    }

    static formatToGermanDate(dateTime) {
        // Ensure we're in Berlin timezone
        const berlin = dateTime.setZone('Europe/Berlin');
        return berlin.toFormat('dd.MM.yyyy');
    }
}

module.exports = DateTimeUtils;
