// 假设您使用 Axios 进行 HTTP 请求

import axios from 'axios';
import { API_URL } from './config'; // 导入配置文件
// 创建一个 Axios 实例
export const api = axios.create({
    baseURL: API_URL,
});

// 添加请求拦截器
api.interceptors.request.use(
    (config) => {
        // 在请求发送之前，可以在这里添加一些公共的请求配置，例如添加 token
        const accessToken = localStorage.getItem('access_token');
        const uid = localStorage.getItem('uid');
        if (accessToken) {
            config.headers['world-access-token'] = accessToken;
            config.headers['uid'] = uid;
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
api.interceptors.response.use(
    (response) => {
        // 在收到响应之后，可以在这里进行一些全局的响应处理
        return response;
    },
    (error) => {
        // 在收到错误响应时，可以在这里进行全局的错误处理
        if (error.response && error.response.status === 401) {
            // 清除本地缓存中的 access_token、uid、ts_ms
            localStorage.removeItem('access_token');
            localStorage.removeItem('uid');
            localStorage.removeItem('ts_ms');
            window.location.href = '/'
            // 可以选择进行页面跳转或其他操作
            // 例如：window.location.href = '/login'; // 跳转到登录页
        }
        return Promise.reject(error);
    }
);

export default api;
