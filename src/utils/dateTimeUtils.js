const { DateTime } = require('luxon');

class DateTimeUtils {
    static getBerlinDateTime() {
        return DateTime.now().setZone('CEST', { keepLocalTime: false });
    }

    static formatToSQLDate(dateTime) {
        const cestTime = dateTime.setZone('CEST', { keepLocalTime: false });
        return cestTime.toFormat('yyyy-MM-dd');
    }

    static formatToSQLDateTime(dateTime) {
        const cestTime = dateTime.setZone('CEST', { keepLocalTime: false });
        return cestTime.toFormat('yyyy-MM-dd HH:mm:ss');
    }

    static getHourMinutes(dateTime) {
        const cestTime = dateTime.setZone('CEST', { keepLocalTime: false });
        console.log('Original time:', dateTime.toISO());
        console.log('CEST time:', cestTime.toISO());
        console.log('CEST hour:', cestTime.hour);
        return {
            hours: cestTime.hour,
            minutes: cestTime.minute,
            totalMinutes: cestTime.hour * 60 + cestTime.minute
        };
    }

    static parseToDateTime(dateStr, format = 'yyyy-MM-dd') {
        return DateTime.fromFormat(dateStr, format, { zone: 'CEST' });
    }

    static formatToGermanDate(dateTime) {
        const cestTime = dateTime.setZone('CEST', { keepLocalTime: false });
        return cestTime.toFormat('dd.MM.yyyy');
    }
}

module.exports = DateTimeUtils;
