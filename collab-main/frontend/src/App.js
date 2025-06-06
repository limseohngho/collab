import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ProjectDetailPage from "./pages/ProjectDetailPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;