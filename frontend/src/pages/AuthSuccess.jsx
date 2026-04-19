import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkLoggedIn } = useAuth();

    useEffect(() => {
        const handleSuccess = async () => {
            const token = searchParams.get('token');
            if (token) {
                localStorage.setItem('token', token);
                // Wait for AuthContext to fetch the user before navigating
                await checkLoggedIn();
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        };
        handleSuccess();
    }, [searchParams, navigate, checkLoggedIn]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#0d1117]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );
};

export default AuthSuccess;
