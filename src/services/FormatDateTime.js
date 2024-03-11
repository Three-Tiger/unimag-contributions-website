
import moment from "moment";

class FormatDateTime {
    toDateTimeString(dateTime) {
        return moment(dateTime).format('MMM Do, YYYY HH:mm:ss');
    }
}

const formatDateTime = new FormatDateTime();
export default formatDateTime;