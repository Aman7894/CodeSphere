import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen bg-[#06080F] text-white overflow-hidden font-sans">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      ></div>

      {/* Decorative Neon Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[60%] h-[20%] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center font-bold text-lg">
            C
          </div>
          <span className="text-xl font-bold tracking-wide">CodeSphere</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-full font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-5 py-2 rounded-full font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/80 border border-blue-500/30 text-blue-400 text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_10px_rgba(59,130,246,0.1)]">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          The Ultimate Collaborative Environment
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Code Faster. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            Together.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Experience the ultimate coding platform with real-time collaboration, an advanced code execution engine, and integrated problem solving like never before.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5">
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)] transition-all transform hover:scale-105"
          >
            Start Coding for Free
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-full font-bold text-lg bg-[#1e293b]/50 border border-gray-700 hover:bg-[#1e293b]/80 hover:border-gray-500 backdrop-blur-md transition-all"
          >
            Sign In
          </button>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-[#0f172a]/40 border border-gray-800/60 backdrop-blur-xl hover:bg-[#0f172a]/60 hover:border-blue-500/30 transition-all transform hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] group">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Multi-Language Support</h3>
            <p className="text-gray-400 leading-relaxed">
              Execute your code in real-time. Supports Python, Java, C++, JavaScript, and more with lightning-fast latency directly in the browser.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-[#0f172a]/40 border border-gray-800/60 backdrop-blur-xl hover:bg-[#0f172a]/60 hover:border-purple-500/30 transition-all transform hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(168,85,247,0.1)] group">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Real-Time Collab</h3>
            <p className="text-gray-400 leading-relaxed">
              Build together. Connect with teammates or friends globally, pair program, and see each other's cursors interact in real time.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-[#0f172a]/40 border border-gray-800/60 backdrop-blur-xl hover:bg-[#0f172a]/60 hover:border-cyan-500/30 transition-all transform hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(6,182,212,0.1)] group">
             <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Competitive Coding</h3>
            <p className="text-gray-400 leading-relaxed">
              Fetch integrated problems from top platforms like Codeforces. Practice algorithms seamlessly and track your performance.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 py-8 text-center text-gray-500 text-sm bg-black/20 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} CodeSphere. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
