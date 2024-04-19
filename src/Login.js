import React, { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5'; // 导入 md5 库
import './Login.css'; // 引入样式文件
import { AUTH_API_ENDPOINT } from './config'; // 导入配置文件
import { useNavigate  } from 'react-router-dom'; // 导入 useHistory


function Login() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        let timer;
        if (message) {
            // 显示错误消息后，3秒后清除错误消息
            timer = setTimeout(() => {
                setMessage('');
            }, 3000);
        }
        return () => clearTimeout(timer); // 在组件卸载时清除定时器
    }, [message]);

    useEffect(() => {
        // 检查本地缓存中是否存在 access_token
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            // 如果存在 access_token，则直接跳转到 Playground 页面
            navigate('/playground');
        }
    }, [navigate]); // 空数组作为第二个参数，表示只在组件挂载时执行一次

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const hashedPassword = md5(password); // 对密码进行 MD5 加密
            const response = await axios.post(`${AUTH_API_ENDPOINT}`, {
                account: account,
                password: hashedPassword,
                auth_type: 0
            });

            const { code, message, data } = response.data;

            if (code === 0) {
                setMessage('登录成功');
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('uid', data.uid);
                navigate('/playground'); // 登录成功后跳转到空页面
            } else {
                setMessage(message); // 更新错误消息
                // alert('登录失败：' + message); // 显示警告弹窗
            }
        } catch (error) {
            console.error('登录失败', error);
            setMessage(error.response.data.message)
            // alert('登录失败：' + error.response.data.message); // 显示警告弹窗
        }
    };

    return (
        <div className="login-container">
            <h2>登录</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>账号:</label>
                    <input type="text" value={account} onChange={(e) => setAccount(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>密码:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">登录</button>
            </form>
            {message && (
                <div className={`message ${message === '登录成功' ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default Login;
