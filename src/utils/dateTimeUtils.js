const { DateTime } = require('luxon');

class DateTimeUtils {
    static getBerlinDateTime() {
        return DateTime.local().setZone('Europe/Berlin', { keepLocalTime: true });
    }

    static formatToSQLDate(dateTime) {
        const berlinTime = dateTime.setZone('Europe/Berlin', { keepLocalTime: true });
        return berlinTime.toFormat('yyyy-MM-dd');
    }

    static formatToSQLDateTime(dateTime) {
        const berlinTime = dateTime.setZone('Europe/Berlin', { keepLocalTime: true });
        return berlinTime.toFormat('yyyy-MM-dd HH:mm:ss');
    }

    static getHourMinutes(dateTime) {
        const berlinTime = dateTime.setZone('Europe/Berlin', { keepLocalTime: true });
        return {
            hours: berlinTime.hour,
            minutes: berlinTime.minute,
            totalMinutes: berlinTime.hour * 60 + berlinTime.minute
        };
    }

    static parseToDateTime(dateStr, format = 'yyyy-MM-dd') {
        return DateTime.fromFormat(dateStr, format, { zone: 'Europe/Berlin' });
    }

    static formatToGermanDate(dateTime) {
        const berlinTime = dateTime.setZone('Europe/Berlin', { keepLocalTime: true });
        return berlinTime.toFormat('dd.MM.yyyy');
    }
}

module.exports = DateTimeUtils;
