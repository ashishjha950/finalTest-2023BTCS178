import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001/api';

class ApiService {
    async getToken() {
        return await AsyncStorage.getItem('token');
    }

    async setToken(token) {
        await AsyncStorage.setItem('token', token);
    }

    async removeToken() {
        await AsyncStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const token = await this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    }

    // Auth
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        await this.setToken(data.data.token);
        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        await this.setToken(data.data.token);
        return data;
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    async logout() {
        await this.removeToken();
    }

    // Recipes
    async getRecipes(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await this.request(`/recipes?${query}`);
    }

    async getRecipe(id) {
        return await this.request(`/recipes/${id}`);
    }

    async searchRecipes(query, params = {}) {
        const searchParams = new URLSearchParams({ q: query, ...params }).toString();
        return await this.request(`/recipes/search?${searchParams}`);
    }

    async addToFavorites(recipeId) {
        return await this.request(`/users/favorites/${recipeId}`, {
            method: 'POST',
        });
    }

    async removeFromFavorites(recipeId) {
        return await this.request(`/users/favorites/${recipeId}`, {
            method: 'DELETE',
        });
    }
}

export default new ApiService();
