const moment = require('moment-timezone');

class DateTimeUtils {
    static getBerlinDateTime() {
        return moment().tz('Europe/Berlin');
    }

    static formatToSQLDate(dateTime) {
        return dateTime.format('YYYY-MM-DD');
    }

    static formatToSQLDateTime(dateTime) {
        return dateTime.format('YYYY-MM-DD HH:mm:ss');
    }

    static getHourMinutes(dateTime) {
        return {
            hours: dateTime.hours(),
            minutes: dateTime.minutes(),
            totalMinutes: dateTime.hours() * 60 + dateTime.minutes()
        };
    }

    static parseToDateTime(dateStr, format = 'YYYY-MM-DD') {
        return moment.tz(dateStr, format, 'Europe/Berlin');
    }

    static formatToGermanDate(dateTime) {
        return dateTime.format('DD.MM.YYYY');
    }
}

module.exports = DateTimeUtils;
