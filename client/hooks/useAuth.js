import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../constants/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    async function loadStorageData() {
        try {
            const authDataSerialized = await AsyncStorage.getItem('@AuthData');
            if (authDataSerialized) {
                const authData = JSON.parse(authDataSerialized);
                setUser(authData.user);
                api.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...userData } = response.data.data;

            if (!token) {
                throw new Error('No token received from server');
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);

            const authData = { token, user: userData };
            await AsyncStorage.setItem('@AuthData', JSON.stringify(authData));

            return { success: true };
        } catch (error) {
            console.error('Login Error:', error);
            const message = error.response?.data?.message || error.message || 'Login failed';
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        await AsyncStorage.removeItem('@AuthData');
    };

    const updateUser = async (newUserData) => {
        try {
            const authDataSerialized = await AsyncStorage.getItem('@AuthData');
            if (authDataSerialized) {
                const authData = JSON.parse(authDataSerialized);
                const updatedUser = { ...authData.user, ...newUserData };
                const updatedAuthData = { ...authData, user: updatedUser };

                await AsyncStorage.setItem('@AuthData', JSON.stringify(updatedAuthData));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Error updating user state:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
