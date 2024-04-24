import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Playground.css'
import './Market.css'
import {api} from './BaseApi'
import {v4 as uuidv4} from 'uuid'; // 引入 uuid 库
import {
    FISH_LIST_API_ENDPOINT,
    FISH_PULL_API_ENDPOINT,
    FISH_SLEEP_API_ENDPOINT,
    FISH_ALIVE_API_ENDPOINT,
    BASE_WS_ENDPOINT,
    USER_ASSET_API_ENDPOINT,
    FISH_REFINE_API_ENDPOINT,
    FISH_PARKING_LIST_API_ENDPOINT
} from './config';
import Market from "./Market"; // 导入配置文件
import {NotificationContainer, NotificationManager} from "react-notifications";
import {
    Badge,
    Stack,
    Button,
    Grid,
    GridItem,
    Card,
    CardBody,
    Heading,
    Text,
    CardHeader,
    Modal,
    ModalOverlay,
    ModalContent,
    useDisclosure,
} from '@chakra-ui/react'

let socket = null;

function Playground() {
    const navigate = useNavigate();
    const [fishList, setFishList] = useState([]);
    const [asset, setAsset] = useState({exp: 0, level: 0, glod: 0});
    const [showMenu, setShowMenu] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [marketOpen, setMarketOpen] = useState(false);
    const [refineFishId, setRefineFishId] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
        localStorage.removeItem('ts_ms');
        navigate('/');
    };
    const fetchFishParkingList = async () => {
        try {
            const response = await api.post(FISH_PARKING_LIST_API_ENDPOINT, {});
            const {code, data} = response.data;
            if (code === 0) {
                // const correctedFishList = data.list.map(fish => ({
                //     ...fish,
                //     id: String(fish.id)
                // }));
                // console.log(data.list)
                // setFishList(correctedFishList);
            } else {
                console.error('获取用户鱼信息失败：', response.data.message);
            }
        } catch (error) {
            console.error('获取用户鱼信息失败：', error);
        }
    };

    const fetchFishList = async () => {
        try {
            const response = await api.post(FISH_LIST_API_ENDPOINT, {});
            const {code, data} = response.data;
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
    const fetchUserAsset = async () => {
        try {
            const response = await api.post(USER_ASSET_API_ENDPOINT, {});
            const {code, data} = response.data;
            if (code === 0) {
                setAsset(data);
            } else {
                console.error('获取用户资产失败：', response.data.message);
            }
        } catch (error) {
            console.error('获取用户资产失败：', error);
        }
    };
    const handleOpenMarket = () => {
        setMarketOpen(true);
        onOpen();
    }
    const closeTopModal = () => {
        setMarketOpen(false);
        setRefineFishId(0)
        onClose()
    }

    const handleSleepClick = (fishId) => {
        // 发送休息请求
        api.post(FISH_SLEEP_API_ENDPOINT, {fish_id: fishId})
            .then(response => {
                if (response.data.code === 0) {
                    fetchFishList();
                } else {
                    NotificationManager.error('', response.data.message, 3000, () => {
                        alert('callback');
                    });
                }
                // 重新加载鱼列表数据
            })
            .catch(error => {
                console.error('Error resting fish:', error);
            });
    };

    const handleRefineClick = (fishId) => {
        // 发送炼化请求
        setRefineFishId(fishId)
        onOpen();
    };

    const refine = (fishId) => {
        // 发送炼化请求
        api.post(FISH_REFINE_API_ENDPOINT, {fish_id: fishId})
            .then(response => {
                if (response.data.code === 0) {
                    fetchFishList();
                    closeTopModal()
                } else {
                    NotificationManager.error('', response.data.message, 3000, () => {
                        alert('callback');
                    });
                }
                // 重新加载鱼列表数据
            })
            .catch(error => {
                console.error('Error resting fish:', error);
            });
    };

    const handleAliveClick = (fishId) => {
        // 发送休息请求
        api.post(FISH_ALIVE_API_ENDPOINT, {fish_id: fishId})
            .then(response => {
                if (response.data.code === 0) {
                    fetchFishList();
                } else {
                    NotificationManager.error('', response.data.message, 3000, () => {
                        alert('callback');
                    })
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
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='blue.300' onClick={() => handleSleepClick(fishId)}>休息</Button>
                </Stack>);
            case 1:
                return (
                    <Stack mt={3} direction='row' spacing={4} align='center'>
                        <Button bg='green.300'
                                onClick={() => handleAliveClick(fishId)}>激活</Button>
                        <Button bg='yellow.300'>上架</Button>
                        <Button bg='orange.300' onClick={() => handleRefineClick(fishId)}>炼化</Button>
                    </Stack>
                );
            case 2:
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='blue.300'>下架</Button>
                </Stack>);
            case 3:
                return (
                    <Stack mt={3} direction='row' spacing={4} align='center'>
                        <Button bg='orange.300' onClick={() => handleRefineClick(fishId)}>炼化</Button>
                    </Stack>
                );
            default:
                return null;
        }
    }
    useEffect(() => {
        const pullFish = async () => {
            try {
                const response = await api.post(FISH_PULL_API_ENDPOINT, {})
                const {code, data} = response.data;
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
            } catch (error) {
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
                if (message.type === 'ask' && (message.err_no === 0 || message.err_no == null)) {
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
        // 每隔 1 秒发送 ping 消息
        const pingInterval = setInterval(() => {
            if (socket != null && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({type: 'ping'}));
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
            socket.close();
            socket = null
        };
    }, [navigate, fishList]);

    useEffect(() => {
        fetchFishList()
        fetchUserAsset()
        const handleAccessTokenChange = (event) => {
            console.log(event)
            if (event.key === 'access_token' && !event.newValue) {
                // 如果 access_token 被清空，则立即跳转回登录页面
                window.location.href = '/'
            }
        };
        // 监听本地缓存中 access_token 的变化
        window.addEventListener('storage', handleAccessTokenChange);
        return () => {
            window.removeEventListener('storage', handleAccessTokenChange);
        }
    }, [])

    return (
        <Grid templateColumns='repeat(24, 1fr)'>
            <GridItem colSpan={23}>
                <Stack direction='row' mt={5} ml={10}>
                    <Badge variant='solid' colorScheme='whatsapp'>
                        等级: {asset.level}
                    </Badge>
                    <Badge variant='solid' colorScheme='whatsapp'>
                        经验: {asset.exp}
                    </Badge>
                    <Badge variant='solid' colorScheme='whatsapp'>
                        晶石: {asset.gold}
                    </Badge>
                </Stack>
                <Grid templateRows='repeat(2, 1fr)'
                      templateColumns='repeat(3, 1fr)'
                      gap={10}
                      padding={10}
                >
                    {Array.isArray(fishList) && fishList.map(fish => (
                        <GridItem colSpan={1} key={String(fish.id)}>
                            <Card bg={getStatusColor(fish.status)} padding={5}>
                                <CardHeader>
                                    <Heading>
                                        {fish.name}
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    <Text>修为：{fish.weight}</Text>
                                    <Text>生命：{fish.heal}/{fish.max_heal}</Text>
                                    <Text>自愈：{fish.recover_speed}</Text>
                                    <Text>攻击：{fish.atk}</Text>
                                    <Text>防御：{fish.def}</Text>
                                    <Text>修炼：{fish.earn_speed}</Text>
                                    <Text>闪避：{fish.dodge}</Text>
                                    <Text>灵气：{fish.money}</Text>
                                </CardBody>
                                {renderActionButtons(fish.status, String(fish.id))}
                            </Card>
                        </GridItem>
                    ))}
                </Grid>
                <Modal
                    isOpen={isOpen}
                    onClose={closeTopModal}
                    isCentered
                    motionPreset='slideInBottom'
                    size='6xl'
                >
                    <ModalOverlay/>
                    {marketOpen && (
                        <ModalContent>
                            <Market/>
                        </ModalContent>
                    )}
                    {refineFishId !== 0 && (
                        <ModalContent border={1}>
                            <Card padding={2}>
                                <CardHeader>
                                    <Heading fontSize={30}>确认炼化?</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Stack direction='row'>
                                        <Button size='sm' colorScheme='orange'
                                                onClick={() => refine(refineFishId)}>确认</Button>
                                        <Button size='sm' colorScheme='blue' onClick={closeTopModal}>取消</Button>
                                    </Stack>
                                </CardBody>
                            </Card>
                        </ModalContent>
                    )}
                </Modal>
                <NotificationContainer/>
            </GridItem>
            <GridItem colSpan={1} padding={3}>
                <Button onClick={() => setShowMenu(!showMenu)}>菜单</Button>
                {showMenu && (<Stack mt={2}>
                    <Button className="circle" onClick={handleOpenMarket}>交易</Button>
                    <Button className="circle">排行</Button>
                    <Button className="circle">背包</Button>
                    <Button className="circle">技能</Button>
                    <Button className="circle">建筑</Button>
                    <Button className="circle" onClick={handleLogout}>退出</Button>
                </Stack>)}
            </GridItem>

        </Grid>
    );
}

function getStatusColor(status) {
    switch (status) {
        case 0:
            return 'green.300';
        case 1:
            return 'blue.300';
        case 3:
            return 'gray.300';
        case 2:
            return 'yellow.300';
        default:
            return '';
    }
}


export default Playground;