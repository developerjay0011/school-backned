const { DateTime } = require('luxon');

class DateTimeUtils {
    static getBerlinDateTime() {
        // Create in system timezone then convert to Berlin
        const now = new Date();
        const berlinStr = now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
        const berlin = new Date(berlinStr);
        console.log('System time:', now.toString());
        console.log('Berlin time:', berlin.toString());
        return berlin;
    }

    static getHourMinutes(dateTime) {
        // Get hours and minutes in Berlin timezone
        const berlinTime = dateTime.toLocaleString('en-US', { 
            timeZone: 'Europe/Berlin',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });
        const [hours, minutes] = berlinTime.split(':').map(Number);
        console.log('Berlin time components:', hours, ':', minutes);
        
        return {
            hours,
            minutes,
            totalMinutes: hours * 60 + minutes
        };
    }

    static formatToSQLDate(dateTime) {
        return dateTime.toLocaleString('en-US', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('/').reverse().join('-');
    }

    static formatToSQLDateTime(dateTime) {
        const date = this.formatToSQLDate(dateTime);
        const time = dateTime.toLocaleString('en-US', {
            timeZone: 'Europe/Berlin',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        console.log("time",time);
        return `${date} ${time}`;
    }

    static parseToDateTime(dateStr, format = 'yyyy-MM-dd') {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    static formatToGermanDate(dateTime) {
        return dateTime.toLocaleString('de-DE', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
}

module.exports = DateTimeUtils;
