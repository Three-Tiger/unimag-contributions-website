import storageService from "./StorageService";

class AuthService {
    logout() {
        this.clearLogin();
    }

    clearLogin() {
        storageService.remove('ACCESS_TOKEN');
        storageService.remove('USER_ROLE');
        storageService.remove('USER_DATA');
    }

    saveToken(token) {
        storageService.save('ACCESS_TOKEN', token);
    }

    saveUser(user) {
        this.saveToken(user.accessToken);
        storageService.save('USER_ROLE', user.role);
        storageService.save('USER_DATA', user.user);
    }

    getAccessToken() {
        if (storageService.get('ACCESS_TOKEN')) {
            return storageService.get('ACCESS_TOKEN');
        }
        return null;
    }

    getUserRole() {
        if (storageService.get('USER_ROLE')) {
            return storageService.get('USER_ROLE');
        }
        return null;
    }

    getUserData() {
        if (storageService.get('USER_DATA')) {
            return storageService.get('USER_DATA');
        }
        return null;
    }

    isLogin() {
        if (this.getAccessToken()) {
            return true;
        }
        return false;
    }
}

const authService = new AuthService();
export default authService;