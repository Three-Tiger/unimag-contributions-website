import swalService from "./SwalService";

class HandleError {
    showError(error) {
        switch (error.response.status) {
            case 400:
                swalService.showMessage(
                    "Warning",
                    error.response.data.message,
                    "warning"
                );
                break;
            case 401:
                swalService.showMessage(
                    "Warning",
                    error.response.data.message,
                    "warning"
                );
                break;
            case 403:
                swalService.showMessage(
                    "Warning",
                    "You are not authorized to access this resource. Please contact the administrator.",
                    "warning"
                );
                break;
            case 404:
                swalService.showMessage(
                    "Warning",
                    error.response.data.message,
                    "warning"
                );
                break;
            case 409:
                swalService.showMessage(
                    "Warning",
                    error.response.data.message,
                    "warning"
                );
                break;
            case 500:
                swalService.showMessage(
                    "Error",
                    "Something went wrong. Please try again later.",
                    "error"
                );
                break;
            default:
                swalService.showMessage(
                    "Error",
                    "Something went wrong. Please try again later.",
                    "error"
                );
                break;
        }
    }
}

const handleError = new HandleError();
export default handleError;