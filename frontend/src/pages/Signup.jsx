import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Lock from 'lucide-react/dist/esm/icons/lock';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(formData);
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
                    <h2 className="text-3xl font-bold tracking-tight text-blue-500">Create Account</h2>
                    <p className="mt-2 text-gray-400 text-sm">Join the community and start collaborating</p>
                </div>

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
                        <span className="bg-[#161b22] px-2 text-gray-500">Or regiester with email</span>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                name="username"
                                type="text"
                                required
                                className="block w-full rounded-lg border border-gray-800 bg-[#0d1117] py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
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
                                placeholder="Password (min 6 chars)"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#161b22]"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserPlus className="h-5 w-5 text-blue-300 group-hover:text-blue-100" />
                        </span>
                        Register
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                        Sign in instead <ArrowRight className="inline-block" size={12} />
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
