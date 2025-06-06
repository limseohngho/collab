// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://collab-backend-9jv5.onrender.com/', // 백엔드 주소
});

// 요청을 보낼 때마다 Authorization 헤더에 토큰을 추가
api.interceptors.request.use(
  (config) => {
    // config에 Authorization 헤더 추가
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
