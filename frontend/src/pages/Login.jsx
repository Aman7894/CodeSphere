import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Lock from 'lucide-react/dist/esm/icons/lock';
import LogIn from 'lucide-react/dist/esm/icons/log-in';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

const OAUTH_ERROR_MESSAGES = {
    google_oauth_failed: 'Google authentication failed. Please try again.'
};

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const oauthError = new URLSearchParams(location.search).get('error');
    const oauthErrorMessage = oauthError ? (OAUTH_ERROR_MESSAGES[oauthError] || 'Social login failed. Please try again.') : null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData);
        if (success) navigate('/dashboard');
    };

   const handleSocialLogin = (provider) => {
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    window.location.href = `${backendUrl}/api/auth/${provider}`;
};

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d1117] p-4 text-white">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-800 bg-[#161b22] p-8 shadow-2xl transition-all hover:border-blue-500/50">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-blue-500">Welcome Back</h2>
                    <p className="mt-2 text-gray-400 text-sm">Sign in to your collaborative workspace</p>
                </div>

                {oauthErrorMessage && (
                    <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                        {oauthErrorMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-[#21262d] py-2.5 transition-all hover:bg-[#30363d]"
                    >
                        <Mail size={20} />
                        <span className="text-sm font-medium">Google</span>
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#161b22] px-2 text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full rounded-lg border border-gray-800 bg-[#0d1117] py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                name="password"
                                type="password"
                                required
                                className="block w-full rounded-lg border border-gray-800 bg-[#0d1117] py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-800 bg-[#0d1117] text-blue-500 focus:ring-blue-500" />
                            <label className="ml-2 block text-gray-400 text-xs">Remember me</label>
                        </div>
                        <a href="#" className="font-medium text-blue-500 hover:text-blue-400 text-xs text-right">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#161b22]"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LogIn className="h-5 w-5 text-blue-300 group-hover:text-blue-100" />
                        </span>
                        Sign in
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                        Create one now <ArrowRight className="inline-block" size={12} />
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
