
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
}

const formatDateTime = new FormatDateTime();
export default formatDateTime;