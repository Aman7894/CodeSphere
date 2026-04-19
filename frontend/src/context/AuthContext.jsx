import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkLoggedIn = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return null;
        }

        try {
            const res = await api.get('/auth/me');
            if (res.data.success) {
                setUser(res.data.user);
                return res.data.user;
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
        return null;
    };

    useEffect(() => {
        checkLoggedIn();
    }, []);

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                setUser(res.data.user);
                toast.success('Registration successful!');
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const login = async (userData) => {
        try {
            const res = await api.post('/auth/login', userData);
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                setUser(res.data.user);
                toast.success('Login successful!');
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-xl font-semibold animate-pulse">Initializing Auth...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
