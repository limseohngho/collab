import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert('로그인에 실패했습니다. 이메일 및 비밀번호를 확인해주세요.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLogin} className={styles.button}>Login</button>
      <button onClick={() => navigate('/signup')} className={styles.button}>Sign Up</button>
    </div>
  );
};

export default LoginPage;