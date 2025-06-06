import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userInfo');
    if (storedToken && storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch (error) { console.error('Invalid userInfo:', error); }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const token = res.data.token;
      const userInfo = res.data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setUser(userInfo);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('로그인 실패');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};