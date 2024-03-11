import storageService from "./StorageService";

class AuthService {
    saveToken(token) {
        storageService.save('ACCESS_TOKEN', token);
    }

    saveUser(user) {
        this.saveToken(user.accessToken);
        storageService.save('USER_ROLE', user.role);
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

    isLogin() {
        if (this.getAccessToken()) {
            return true;
        }
        return false;
    }
}

const authService = new AuthService();
export default authService;