import React, {useEffect, useState} from 'react';
import './Playground.css'
import './Market.css'
import {v4 as uuidv4} from 'uuid'; // 引入 uuid 库
import {BASE_WS_ENDPOINT,} from '../config';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Grid,
    GridItem,
    Heading, Image,
    Stack,
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react'
import PropListButton from "./Props";
import {AddIcon} from "@chakra-ui/icons";
import {DecodeBase64} from "../Base64.js";
import {
    CreateFish,
    FetchFishList,
    FetchFishParkingList,
    PullFish,
} from "../request/Fish";
import {Configs, ExpandFishParking, FetchGodheadList, FetchUserAsset, FetchUserBaseInfo} from "../request/User";
import {GetFishColorByRating, GetParkingStatusColor} from "../style/ColorUtil";
import UserBaseInfo from "./UserBaseInfo";
import {FishCardClassNameByStatus} from "../style/StyleUtil";
import {FailedToast, SuccessToast} from "../style/ShowToast";
import FishBaseInfo from "./FishBaseInfo";
import FishHeader from "./FishHeader";
import MailButton from "./MailButton";
import PoolRankButton from "./PoolRankButton";
import MarketButton from "./MarketButton";
import UserSkillsButton from "./UserSkillsButton";
import FishActionButtons from "./FishActionButtons";
import {CheckInSpecial} from "../pkg/UserUtils";
import MoonListIcon from "../assets/special_time/moon_light.svg";

let socket = null;

function Playground() {
    const [fishList, setFishList] = useState([]);
    const [fishMap, setFishMap] = useState({});
    const [fishParkingList, setFishParkingList] = useState([]);
    const [asset, setAsset] = useState({exp: 0, level: 0, gold: 0});
    const [baseInfo, setBaseInfo] = useState({username: ''});
    const [needPull, setNeedPull] = useState(false);
    const [needDestroyFish, setNeedDestroyFish] = useState(null)
    const toast = useToast()
    const [parkingEffect, setParkingEffect] = useState({});
    const [userInfo, setUserInfo] = useState(null);
    const [godheadList, setGodheadList] = useState(null);
    const [inMoonLight, setInMoonLight] = useState(false);

    const [coldDownTriger, setColdDownTriger] = useState(false)
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    useEffect(() => {
        if (asset && baseInfo) {
            setUserInfo({
                username: baseInfo.username,
                level: asset.level,
                exp: asset.exp,
                gold: asset.gold,
                godhead: godheadList
            });
        }
    }, [asset, baseInfo, godheadList]);
    useEffect(() => {
        if (coldDownTriger) {
            const coldDown = () => {
                const newParkingEffects = {
                    ...parkingEffect
                }
                const nowMs = new Date().getTime()
                for (let key of Object.keys(newParkingEffects)) {
                    const effects = [...newParkingEffects[key]]
                    for (let i = 0; i < effects.length; i++) {
                        if (effects[i].effect_expire_ms > 0) {
                            effects[i].effect_expire_ms = effects[i].effect_expire_ms - 1
                        }
                    }
                    newParkingEffects[key] = effects.filter(ef => Math.round((ef.effect_expire_ms - nowMs) / 1000) > 0);
                }
                setParkingEffect(newParkingEffects);
            }
            coldDown();
            setColdDownTriger(false);
        }
    }, [coldDownTriger, parkingEffect]);

    useEffect(() => {
        const cdInterval = setInterval(() => {
            setColdDownTriger(true);
        }, 1000);
        return () => {
            clearInterval(cdInterval);
        }
    }, []);


    const refreshFishList = (fishes) => {
        if (fishes != null) {
            fishes.forEach(item => {
                if (item.fish && (item.fish.status === null || item.fish.status === undefined)) {
                    item.fish.status = 0;
                }
            })
            setFishList(fishes);
        }
    }

    const incrExp = (exp, levelUpCount) => {
        const newAsset = {
            ...asset
        };
        newAsset.exp = asset.exp + exp
        if (levelUpCount !== 0) {
            newAsset.level = newAsset.level + levelUpCount
            SuccessToast('升级啦~ 增加经验' + exp + '！等级提升' + levelUpCount + '！', toast);
        } else {
            SuccessToast('增加经验' + exp + '！', toast);
        }
        setAsset(newAsset);
    }
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
        localStorage.removeItem('ts_ms');
        window.location.href = '/';
    };
    const handleCreateClick = () => {
        // 发送休息请求
        CreateFish((newFish) => {
            const newList = [
                ...fishList,
            ];
            newList.push(newFish);
            refreshFishList(newList);
            FetchUserAsset(setAsset, defaultFailedCallback).then();
            SuccessToast('创建成功', toast);
        }, defaultFailedCallback).then();
    };

    const afterPull = (pullList) => {
        const newList = [...fishList];
        if (Array.isArray(pullList)) {
            pullList.forEach(newFish => {
                const index = newList.findIndex(oldFish => oldFish.fish.id === newFish.fish.id);
                if (index !== -1) {
                    newList[index] = {
                        ...fishList[index],
                        fish: newFish.fish,
                        rating: newFish.rating,
                    };
                }
            });
        }
        refreshFishList(newList);
    }
    useEffect(() => {
        const newFishMap = {}
        const newParkingEffects = {}
        for (let item of fishList) {
            newFishMap[item.parking] = item;
            if (item.fish && Array.isArray(item.fish.effects)) {
                let idx = 0
                newParkingEffects[item.parking] = Array.of();
                const nowMs = new Date().getTime()
                for (let effect of item.fish.effects) {
                    if (Math.round((effect.effect_expire_ms - nowMs) / 1000) > 0) {
                        newParkingEffects[item.parking][idx] = {
                            ...effect
                        };
                        idx++;
                    }
                }
            }
        }
        setParkingEffect(newParkingEffects);
        setFishMap(newFishMap);
    }, [fishList])

    useEffect(() => {
        if (needDestroyFish != null) {
            const destroyFish = (deadFish) => {
                const newFishList = [...fishList];
                const index = newFishList.findIndex(fish => fish.fish.id === deadFish.id);
                const oldFish = newFishList[index];
                newFishList[index] = {
                    ...oldFish,
                    fish: deadFish,
                };
                refreshFishList(newFishList);
                setNeedDestroyFish(null);
            }
            destroyFish(needDestroyFish)
        }
    }, [needDestroyFish, fishList]);

    useEffect(() => {
        // 获取本地缓存中的 access_token 和 uid
        const accessToken = localStorage.getItem('access_token');
        const uid = localStorage.getItem('uid');

        // 创建 WebSocket 连接
        if (socket == null) {
            socket = new WebSocket(`${BASE_WS_ENDPOINT}?t=${accessToken}&u=${uid}`);
            // 监听 WebSocket 连接打开事件
            socket.onopen = () => {
                console.log('WebSocket connection opened');
                // 返回一个清理函数，在组件销毁时停止发送 ping 消息
                return () => {
                };
            };
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'pong') {
                    return
                }
                if (message.type === 'ask' && (message.err_no === 0 || message.err_no == null)) {
                    const decodedBody = DecodeBase64(message.body);
                    const receivedTsMs = JSON.parse(decodedBody).ts_ms;
                    let tsMs = localStorage.getItem('ts_ms') || 0;
                    if (receivedTsMs !== null && receivedTsMs !== undefined && receivedTsMs !== 0 && receivedTsMs !== tsMs) {
                        // 更新本地缓存中的 ts_ms
                        setNeedPull(true)
                    }
                }
                if (message.type === 'fish_dead' && (message.err_no === 0 || message.err_no == null)) {
                    const deadFish = JSON.parse(DecodeBase64(message.body)).fish;
                    setNeedDestroyFish(deadFish);
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
        // 清除监听器
        return () => {
            socket.close();
            socket = null;
        };
    }, []);

    useEffect(() => {
        if (needPull) {
            PullFish(afterPull, defaultFailedCallback).then();
            setNeedPull(false);
        }
    }, [needPull]);

    useEffect(() => {
        // 每隔 1 秒发送 ping 消息
        const pingInterval = setInterval(() => {
            if (socket != null && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({type: 'ping'}));
            }
        }, 1000);
        return () => {
            clearInterval(pingInterval);
        }
    }, [socket])
    useEffect(() => {
        // 每隔 3 秒发送 ask 消息
        const askInterval = setInterval(() => {
            if (socket != null && socket.readyState === WebSocket.OPEN) {
                const messageId = uuidv4(); // 生成唯一的 id
                socket.send(JSON.stringify({type: 'ask', msg_id: messageId}));
            }
        }, 3000);
        return () => {
            clearInterval(askInterval);
        }
    }, [socket])

    useEffect(() => {
        Configs().then(() => {
            FetchFishParkingList(setFishParkingList, defaultFailedCallback).then();
            FetchFishList(refreshFishList, defaultFailedCallback).then();
            FetchUserAsset(setAsset, defaultFailedCallback).then();
            FetchUserBaseInfo(setBaseInfo, defaultFailedCallback).then();
            FetchGodheadList(defaultFailedCallback, setGodheadList).then();
            const timeName = CheckInSpecial();
            if (timeName === '月光普照') {
                setInMoonLight(true);
            }
        });
        const handleAccessTokenChange = (event) => {
            console.log(event);
            if (event.key === 'access_token' && !event.newValue) {
                // 如果 access_token 被清空，则立即跳转回登录页面
                window.location.href = '/';
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
                <Box ml={10} mt={3}>
                    {userInfo && (<UserBaseInfo maxW={300} info={userInfo} onlyShow={false}/>)}
                    {inMoonLight && (
                        <Image maxH='40px' src={MoonListIcon}/>
                    )}
                </Box>
                <Grid templateRows='repeat(2, 1fr)'
                      templateColumns='repeat(3, 1fr)'
                      gap={10}
                      padding={10}
                >
                    {Array.isArray(fishParkingList) && fishParkingList.filter(fp => fp.status !== 0).map(fishParking => (
                        <GridItem colSpan={1} rowSpan={1} key={fishParking.parking}>
                            {fishMap[fishParking.parking] != null && (
                                <Card
                                    className={FishCardClassNameByStatus(fishMap[fishParking.parking].fish.status)}
                                    bg={GetFishColorByRating(fishMap[fishParking.parking].rating)}
                                    height='100%'
                                    padding={5}>
                                    <CardHeader>
                                        <FishHeader fish={fishMap[fishParking.parking].fish}
                                                    effectList={parkingEffect[fishParking.parking]}/>
                                    </CardHeader>
                                    <CardBody mt={-5}>
                                        <FishBaseInfo fish={fishMap[fishParking.parking].fish}/>
                                    </CardBody>
                                    <FishActionButtons fish={fishMap[fishParking.parking].fish} fishList={fishList} fishParkingList={fishParkingList} asset={asset} refreshFishList={refreshFishList} setFishParkingList={setFishParkingList} setAsset={setAsset} defaultFailedCallback={defaultFailedCallback} />
                                </Card>
                            )}
                            {(!Array.isArray(fishList) || fishList.findIndex(oldFish => oldFish.parking === fishParking.parking) === -1) && (
                                <Card height='100%' padding={5} bg={GetParkingStatusColor(fishParking.status)}>
                                    <CardHeader>
                                        <Heading>
                                            {fishParking.parking}
                                        </Heading>
                                    </CardHeader>
                                    <CardBody height='100%'>
                                        {fishParking.status === 0 && (
                                            <Text fontSize={40} textAlign='center'>未拓展</Text>
                                        )}
                                        {fishParking.status === 1 && (
                                            <Text fontSize={40} textAlign='center'>空闲</Text>
                                        )}
                                    </CardBody>
                                </Card>
                            )}
                        </GridItem>
                    ))}
                    {Array.isArray(fishParkingList) && fishParkingList.findIndex(fishParking => fishParking.status === 0) !== -1 && (
                        <GridItem colSpan={1} rowSpan={1}>
                            <Card height='100%' padding={5} bg='gray.400'>
                                <CardHeader>
                                    <Heading>
                                        未拓展鱼位
                                    </Heading>
                                </CardHeader>
                                <CardBody height='100%'>
                                    <Stack direction='row' align='center'>
                                        <AddIcon ml='45%' boxSize='3em'/>
                                    </Stack>
                                </CardBody>
                                <Stack>
                                    <Button colorScheme='gray' onClick={() => {
                                        ExpandFishParking((newParking) => {
                                            const index = fishParkingList.findIndex(p => p.parking === newParking.parking)
                                            if (index !== -1) {
                                                const newParkingList = [
                                                    ...fishParkingList
                                                ]
                                                const np = {
                                                    ...fishParkingList[index]
                                                }
                                                np.status = newParking.status;
                                                newParkingList[index] = np;
                                                setFishParkingList(newParkingList);
                                            }
                                            if (newParking.cost !== 0) {
                                                const newAsset = {
                                                    ...asset
                                                };
                                                newAsset.gold = asset.gold - newParking.cost;
                                                setAsset(newAsset);
                                            }
                                            SuccessToast('拓展成功!', toast);
                                        }, defaultFailedCallback).then()
                                    }}>拓展</Button>
                                </Stack>
                            </Card>
                        </GridItem>
                    )}
                </Grid>
            </GridItem>
            <GridItem colSpan={1} padding={3}>
                <VStack mt={90}>
                    <Button onClick={handleCreateClick}>创建</Button>
                    <MarketButton buttonFunc={(onOpen) => (<Button onClick={onOpen}>交易</Button>)}/>
                    <PoolRankButton buttonFunc={(onOpen) => (<Button onClick={onOpen}>排行</Button>)}/>
                    <PropListButton columns={8} size='3xl' pageSize={20} incrExp={incrExp} buttonFunc={(onOpen) => (<Button onClick={onOpen}>背包</Button>)} />
                    <UserSkillsButton fishList={fishList} asset={asset} setAsset={setAsset} buttonFunc={(onOpen) => (<Button onClick={onOpen}>技能</Button>)}/>
                    <Button>建筑</Button>
                    <MailButton/>
                    <Button onClick={handleLogout}>退出</Button>
                </VStack>
            </GridItem>
        </Grid>
    );
}

export default Playground;