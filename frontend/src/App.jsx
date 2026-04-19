import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import EditorPage from './pages/EditorPage';
import AuthSuccess from './pages/AuthSuccess';
import Problems from './pages/Problems';
import ContestProblems from './pages/ContestProblems';
import ProblemDetail from './pages/ProblemDetail';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0d1117]">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth-success" element={<AuthSuccess />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/problems/contest/:contestId" element={<ContestProblems />} />
              <Route path="/problems/:contestId/:problemIndex" element={<ProblemDetail />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/editor/:roomId" element={<EditorPage />} />
            </Route>

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b22',
              color: '#fff',
              border: '1px solid #30363d'
            }
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
