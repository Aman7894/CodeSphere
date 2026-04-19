import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import Users from 'lucide-react/dist/esm/icons/users';
import Plus from 'lucide-react/dist/esm/icons/plus';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [joinRoomId, setJoinRoomId] = useState('');
    const navigate = useNavigate();

    const createNewRoom = () => {
        const roomId = Math.random().toString(36).substring(2, 12); // Simple random ID
        toast.success("New room created!");
        navigate(`/editor/${roomId}`);
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (!joinRoomId.trim()) {
            return toast.error("Please enter a valid Room ID");
        }
        navigate(`/editor/${joinRoomId.trim()}`);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-white">
            <nav className="border-b border-gray-800 bg-[#161b22] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/codesphere-logo.svg" alt="CodeSphere logo" className="h-9 w-9 rounded-lg" />
                        <h1 className="text-xl font-bold tracking-tight">CodeSphere <span className="text-blue-500">Editor</span></h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-[#21262d] px-3 py-1.5">
                            <img src={user?.avatar} alt={user?.username} className="h-6 w-6 rounded-full" />
                            <span className="text-sm font-medium">{user?.username}</span>
                        </div>
                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-500/20"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 border border-blue-500/20 shadow-xl">
                        <h2 className="text-3xl font-bold">Hello, {user?.username} 👋</h2>
                        <p className="mt-2 text-gray-400 text-lg">Start a real-time collaborative coding session or join your team's room.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="group rounded-2xl border border-gray-800 bg-[#161b22] p-8 transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10">
                            <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-500">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">Problems</h3>
                            <p className="mb-6 text-gray-400 text-sm">
                                Browse the Codeforces problemset and contests, then open any problem in the editor.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate('/problems')}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold transition-all hover:bg-emerald-500 active:scale-95"
                            >
                                <BookOpen size={20} />
                                Browse problems
                            </button>
                        </div>

                        <div className="group rounded-2xl border border-gray-800 bg-[#161b22] p-8 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
                            <div className="mb-4 inline-flex rounded-xl bg-blue-500/10 p-3 text-blue-500">
                                <Plus size={32} />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">New Editor Room</h3>
                            <p className="mb-6 text-gray-400 text-sm">Create a fresh playground with its own shared document and invite teammates.</p>
                            <button 
                                onClick={createNewRoom}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold transition-all hover:bg-blue-500 active:scale-95"
                            >
                                <Plus size={20} />
                                Create Room
                            </button>
                        </div>

                        <div className="group rounded-2xl border border-gray-800 bg-[#161b22] p-8 transition-all hover:border-purple-500/50">
                            <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3 text-purple-500">
                                <Users size={32} />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">Join Existing Room</h3>
                            <p className="mb-6 text-gray-400 text-sm">Enter a Room ID or paste a link to join your teammates in an existing space.</p>
                            <form onSubmit={joinRoom} className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Room ID" 
                                    className="flex-1 rounded-lg border border-gray-800 bg-[#0d1117] px-4 py-2 focus:border-purple-500 focus:outline-none transition-colors"
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    className="rounded-lg bg-gray-700 px-6 py-2 font-semibold transition-all hover:bg-gray-600 active:scale-95"
                                >
                                    Join
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
