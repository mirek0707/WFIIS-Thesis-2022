import axios from 'axios';
import authHeader from './auth_header';

const API_URL = 'http://localhost:3001/api/test/';

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }
}

export default new UserService();
