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

    static formatZoomLinkDate(date) {
        // If it's already a moment object, just format it
        if (moment.isMoment(date)) {
            return date.format('YYYY-MM-DD');
        }

        // If it's a string, parse it and format
        if (typeof date === 'string') {
            const parsedDate = moment.tz(date, 'YYYY-MM-DD', 'Europe/Berlin');
            if (parsedDate.isValid()) {
                return parsedDate.format('YYYY-MM-DD');
            }
        }

        // If it's a Date object, convert to moment and format
        if (date instanceof Date) {
            return moment.tz(date, 'Europe/Berlin').format('YYYY-MM-DD');
        }

        return null;
    }
}

module.exports = DateTimeUtils;
