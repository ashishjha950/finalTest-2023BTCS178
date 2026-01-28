import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await apiService.getToken();
            if (token) {
                const response = await apiService.getCurrentUser();
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await apiService.removeToken();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await apiService.login(email, password);
        setUser(response.data);
        return response;
    };

    const register = async (userData) => {
        const response = await apiService.register(userData);
        setUser(response.data);
        return response;
    };

    const logout = async () => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
