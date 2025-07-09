const { DateTime } = require('luxon');

class DateTimeUtils {
    static getBerlinDateTime() {
        const now = new Date();
        return now;
    }

    static getHourMinutes(dateTime) {
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
        const berlinDate = new Date(dateTime).toLocaleString('en-US', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const [month, day, year] = berlinDate.split('/');
        return `${year}-${month}-${day}`;
    }

    static formatToSQLDateTime(dateTime) {
        // Get date components
        const berlinDate = new Date(dateTime).toLocaleString('en-US', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const [month, day, year] = berlinDate.split('/');

        // Get time components
        const berlinTime = new Date(dateTime).toLocaleString('en-US', {
            timeZone: 'Europe/Berlin',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).split(', ')[1];
        
        // Format as YYYY-MM-DD HH:mm:ss
        const formattedDateTime = `${year}-${month}-${day} ${berlinTime}`;
        console.log('Formatted DateTime:', formattedDateTime);
        return formattedDateTime;
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
