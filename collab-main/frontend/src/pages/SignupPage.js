import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import styles from '../styles/LoginPage.module.css';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/signup', { username, email, password });
      alert('회원가입이 완료되었습니다! 로그인 해주세요.');
      navigate('/');
    } catch (error) {
      const msg =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        '회원가입에 실패했습니다. 이미 등록된 이메일일 수 있습니다.';
      alert(msg);
      console.error('Signup failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? '가입 중...' : 'Sign Up'}
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => navigate('/')}
          style={{ marginTop: 10 }}
        >
          로그인으로 돌아가기
        </button>
      </form>
    </div>
  );
};

export default SignupPage;