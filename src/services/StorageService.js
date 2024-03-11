class StorageService {
    clear() {
        localStorage.clear();
    }

    save(key, data) {
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(data));
    }

    remove(key) {
        localStorage.removeItem(key);
    }

    get(key) {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    }
}

const storageService = new StorageService();
export default storageService;