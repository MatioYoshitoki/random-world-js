import React, {useState, useEffect} from 'react';
import {api} from './BaseApi'
import md5 from 'md5'; // 导入 md5 库
import {AUTH_API_ENDPOINT} from './config'; // 导入配置文件
import {useNavigate} from 'react-router-dom';
import {Input, Stack, Heading, Button, useToast} from '@chakra-ui/react';
import {FailedToast, SuccessToast} from "./style/ShowToast";


function Login() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
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
            const response = await api.post(AUTH_API_ENDPOINT, {
                account: account,
                password: hashedPassword,
                auth_type: 0
            });

            const {code, message, data} = response.data;

            if (code === 0) {
                SuccessToast( '登录成功', toast);
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('uid', data.uid);
                navigate('/playground'); // 登录成功后跳转到空页面
            } else {
                FailedToast(message, toast);
                // alert('登录失败：' + message); // 显示警告弹窗
            }
        } catch (error) {
            FailedToast(error.response.data.message, toast);
            // alert('登录失败：' + error.response.data.message); // 显示警告弹窗
        }
    };

    return (
        <Stack spacing={4} width="300px" mx="auto" mt="100px">
            <Heading textAlign="center">登录</Heading>
            <Input type="text" placeholder="账号" value={account} onChange={(e) => setAccount(e.target.value)}/>
            <Input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Button mt={5} w={150} left={75} colorScheme='whatsapp' onClick={handleSubmit}>
                登录
            </Button>
        </Stack>
    );
}

export default Login;
