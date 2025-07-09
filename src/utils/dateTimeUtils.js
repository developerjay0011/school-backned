const { DateTime } = require('luxon');

class DateTimeUtils {
    static getBerlinDateTime() {
        return DateTime.now().setZone('Europe/Berlin').toLocal();
    }

    static formatToSQLDate(dateTime) {
        return dateTime.toFormat('yyyy-MM-dd').toLocal();
    }

    static formatToSQLDateTime(dateTime) {
        return dateTime.toFormat('yyyy-MM-dd HH:mm:ss').toLocal();
    }

    static getHourMinutes(dateTime) {
        return {
            hours: dateTime.hour,
            minutes: dateTime.minute,
            totalMinutes: dateTime.hour * 60 + dateTime.minute
        };
    }

    static parseToDateTime(dateStr, format = 'yyyy-MM-dd') {
        return DateTime.fromFormat(dateStr, format, { zone: 'Europe/Berlin' }).toLocal();
    }

    static formatToGermanDate(dateTime) {
        return dateTime.toFormat('dd.MM.yyyy').toLocal();
    }
}

module.exports = DateTimeUtils;
