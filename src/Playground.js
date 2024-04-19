import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Playground.css'
import { v4 as uuidv4 } from 'uuid'; // 引入 uuid 库
import { FISH_LIST_API_ENDPOINT, FISH_PULL_API_ENDPOINT, FISH_SLEEP_API_ENDPOINT, FISH_ALIVE_API_ENDPOINT, BASE_WS_ENDPOINT } from './config'; // 导入配置文件

let socket = null;
let loadFinished = false;

function Playground() {
    const navigate = useNavigate();
    const [fishList, setFishList] = useState([]);
    const [message, setMessage] = useState('');
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
        navigate('/');
    };
    const fetchFishList = async () => {
        try {
            const uid = localStorage.getItem('uid');
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.post(FISH_LIST_API_ENDPOINT, {}, {
                headers: {
                    'uid': uid,
                    'world-access-token': accessToken,
                    'Content-Type': 'application/json'
                }
            });
            const { code, data } = response.data;
            if (code === 0) {
                const correctedFishList = data.list.map(fish => ({
                    ...fish,
                    id: String(fish.id)
                }));
                console.log(data.list)
                setFishList(correctedFishList);
            } else {
                console.error('获取用户鱼信息失败：', response.data.message);
            }
        } catch (error) {
            console.error('获取用户鱼信息失败：', error);
        }
    };
    const handleSleepClick = (fishId) => {
        console.log(fishId)
        const uid = localStorage.getItem('uid');
        const accessToken = localStorage.getItem('access_token');
        // 发送休息请求
        axios.post(FISH_SLEEP_API_ENDPOINT, {
            fish_id: fishId
        }, {
            headers: {
                'uid': uid,
                'world-access-token': accessToken,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.data.code === 0) {
                    fetchFishList();
                } else {
                    setMessage(response.data.message)
                }
                // 重新加载鱼列表数据
            })
            .catch(error => {
                console.error('Error resting fish:', error);
            });
    };

    const handleAliveClick = (fishId) => {
        console.log(fishId)
        const uid = localStorage.getItem('uid');
        const accessToken = localStorage.getItem('access_token');
        // 发送休息请求
        axios.post(FISH_ALIVE_API_ENDPOINT, {
            fish_id: fishId
        }, {
            headers: {
                'uid': uid,
                'world-access-token': accessToken,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.data.code === 0) {
                    fetchFishList();
                } else {
                    setMessage(response.data.message)
                }
                // 重新加载鱼列表数据
            })
            .catch(error => {
                console.error('Error resting fish:', error);
            });
    };

    const renderActionButtons = (status, fishId) => {
        switch (status) {
            case 0:
                return (<div className="fish-card-buttons">
                    <button onClick={() => handleSleepClick(fishId)}>休息</button>
                </div>);
            case 1:
                return (
                    <div className="fish-card-buttons">
                        <button onClick={() => handleAliveClick(fishId)}>激活</button>
                        <button>上架</button>
                        <button>炼化</button>
                    </div>
                );
            case 2:
                return (<div className="fish-card-buttons">
                    <button>下架</button>
                </div>);
            case 3:
                return (
                    <div className="fish-card-buttons">
                        <button>炼化</button>
                    </div>
                );
            default:
                return null;
        }
    }
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
        const handleAccessTokenChange = () => {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                // 如果 access_token 被清空，则立即跳转回登录页面
                navigate('/');
            }
        };


        const pullFish = async () => {
            try {
                const uid = localStorage.getItem('uid');
                const accessToken = localStorage.getItem('access_token');
                const response = await axios.post(FISH_PULL_API_ENDPOINT, {}, {
                    headers: {
                        'uid': uid,
                        'world-access-token': accessToken,
                        'Content-Type': 'application/json'
                    }})
                const { code, data } = response.data;
                if (code === 0) {
                    const newList = [...fishList];
                    data.list.forEach(newFish => {
                        const index = newList.findIndex(oldFish => oldFish.id === newFish.id);
                        if (index !== -1) {
                            console.log(data)
                            newList[index] = {
                                ...fishList[index],
                                weight: newFish.weight,
                                max_heal: newFish.max_heal,
                                heal: newFish.heal,
                                recover_speed: newFish.recover_speed,
                                atk: newFish.atk,
                                def: newFish.def,
                                earn_speed: newFish.earn_speed,
                                dodge: newFish.dodge,
                                money: newFish.money
                            }
                        }
                    });
                    setFishList(newList);
                    localStorage.setItem("ts_ms", data.ts_ms)
                } else {
                    console.error('获取用户鱼信息失败：', response.data.message);
                }
            }catch (error) {
                console.error('获取用户鱼信息失败：', error);
            }
        };
        // 获取本地缓存中的 access_token 和 uid
        const accessToken = localStorage.getItem('access_token');
        const uid = localStorage.getItem('uid');
        let tsMs = localStorage.getItem('ts_ms') || 0;

        // 创建 WebSocket 连接
        if (!socket) {
            socket = new WebSocket(`${BASE_WS_ENDPOINT}?t=${accessToken}&u=${uid}`);
            // 监听 WebSocket 连接打开事件
            socket.onopen = () => {
                console.log('WebSocket connection opened');
                // 返回一个清理函数，在组件销毁时停止发送 ping 消息
                return () => {
                };
            };

            // 监听 WebSocket 接收消息事件
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message)
                if (message.type === 'pong') {
                    return
                }
                if (message.type === 'ask' && (message.err_no === 0 || message.err_no == null) ) {
                    const decodedBody = atob(message.body);
                    const receivedTsMs = JSON.parse(decodedBody).ts_ms;
                    console.log("receive ts ms:" + receivedTsMs)
                    if (receivedTsMs !== null && receivedTsMs !== undefined && receivedTsMs !== 0 && receivedTsMs !== tsMs) {
                        // 更新本地缓存中的 ts_ms
                        pullFish()
                    }
                }
            };

            // 监听 WebSocket 连接错误事件
            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (error.code === 401) {
                    // 清空本地缓存中的 access_token 和 uid
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('uid');
                    localStorage.removeItem('ts_ms');
                }
            };
        }
        if (!loadFinished) {
            fetchFishList()
            loadFinished = true
        }
        // 监听本地缓存中 access_token 的变化
        window.addEventListener('storage', handleAccessTokenChange);
        // 每隔 1 秒发送 ping 消息
        const pingInterval = setInterval(() => {
            if (socket != null && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'ping' }));
            }
        }, 1000);

        // 每隔 3 秒发送 ask 消息
        const askInterval = setInterval(() => {
            if (socket != null && socket.readyState === WebSocket.OPEN) {
                const messageId = uuidv4(); // 生成唯一的 id
                socket.send(JSON.stringify({type: 'ask', msg_id: messageId}));
            }
        }, 3000);
        // 清除监听器
        return () => {
            clearInterval(pingInterval);
            clearInterval(askInterval);
            window.removeEventListener('storage', handleAccessTokenChange);
            socket.close();
            socket = null
        };
    }, [navigate, fishList]);

    return (
        <div className="playground-container">
            <div className="logout-button-container">
                <button className="logout-button" onClick={handleLogout}>退出登录</button>
            </div>
            <div className="fish-card-container">
                {Array.isArray(fishList) && fishList.map(fish => (
                    <div className={`fish-card ${getStatusColor(fish.status)}`} key={String(fish.id)}>
                        <h2>{fish.name}</h2>
                        <p>修为：{fish.weight}</p>
                        <p>生命：{fish.heal}/{fish.max_heal}</p>
                        <p>自愈：{fish.recover_speed}</p>
                        <p>攻击：{fish.atk}</p>
                        <p>防御：{fish.def}</p>
                        <p>修炼：{fish.earn_speed}</p>
                        <p>闪避：{fish.dodge}</p>
                        <p>灵气：{fish.money}</p>
                        {renderActionButtons(fish.status, String(fish.id))}
                    </div>
                ))}
            </div>
            {message && (
                <div className={`message ${message === '登录成功' ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

function getStatusColor(status) {
    switch (status) {
        case 0:
            return 'green';
        case 1:
            return 'lightblue';
        case 3:
            return 'grey';
        case 2:
            return 'yellow';
        default:
            return '';
    }
}


export default Playground;