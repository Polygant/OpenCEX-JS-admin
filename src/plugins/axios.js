import axios from 'axios';

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = 'Token ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;