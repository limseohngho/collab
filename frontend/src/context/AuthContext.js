import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // axios 인터셉터 등록 (최초 1회)
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 새로고침 시 로그인 유지
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userInfo');
    if (storedToken && storedUser) {
      try {
        // 토큰이 유효하면 userInfo(JSON)를 파싱해서 user로 저장
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Invalid userInfo:', error);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const token = res.data.token;
      const userInfo = res.data.user; // 서버에서 user 반환

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