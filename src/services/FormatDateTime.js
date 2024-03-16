
import moment from "moment";

class FormatDateTime {
    toDateTimeString(dateTime) {
        return moment(dateTime).format('MMM Do, YYYY HH:mm:ss');
    }

    toDateString(dateTime) {
        return moment(dateTime).format('MMM Do, YYYY');
    }

    toBirthdayString(dateTime) {
        return moment(dateTime).format('YYYY-MM-DD');
    }

    subtractDateTime(dateTime) {
        // Get the current date and time
        var now = moment();

        // Set your target datetime
        var targetDateTime = moment(dateTime);

        // Calculate the difference
        var diff = targetDateTime.diff(now);

        // Convert the difference to a duration
        var duration = moment.duration(diff);

        // Get the remaining time in hours, minutes, and seconds
        var remainingDays = duration.days();
        var remainingHours = duration.hours();
        var remainingMinutes = duration.minutes();

        // Return the remaining time
        return `${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes`;
    }
}

const formatDateTime = new FormatDateTime();
export default formatDateTime;