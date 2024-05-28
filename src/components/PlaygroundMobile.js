import React, {useEffect, useState} from 'react';
import './Playground.css'
import './Market.css'
import {v4 as uuidv4} from 'uuid'; // 引入 uuid 库
import {BASE_WS_ENDPOINT,} from '../config';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Grid,
    GridItem,
    HStack,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Progress,
    SimpleGrid,
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react'
import PropListButton from "./Props";
import {DecodeBase64} from "../Base64.js";
import {
    CreateFish,
    FetchFishList,
    FetchFishParkingList,
    PullFish,
} from "../request/Fish";
import {Configs, ExpandFishParking, FetchGodheadList, FetchUserAsset, FetchUserBaseInfo} from "../request/User";
import {
    GetFishColorByRating,
    GetFishColorByRatingMobile,
    GetHpProgressColor,
    GetParkingStatusColorMobile
} from "../style/ColorUtil";
import FishStatusIcon from "./FishStatusIcon";
import {FishCardClassNameByStatus} from "../style/StyleUtil";

import buildingIcon from '../assets/mobile_button_icon/building.svg';
import createIcon from '../assets/mobile_button_icon/create.svg';
import marketIcon from '../assets/mobile_button_icon/market.svg';
import skillsIcon from '../assets/mobile_button_icon/skills.svg';
import poolRankIcon from '../assets/mobile_button_icon/pool_rank.svg';
import propsIcon from '../assets/mobile_button_icon/props.svg';
import {FailedToast, SuccessToast} from "../style/ShowToast";
import FishHeaderMobile from "./FishHeaderMobile";
import FishBaseInfoMobile from "./FishBaseInfoMobile";
import UserBaseInfoMobile from "./UserBaseInfoMobile";
import {RepeatIcon} from "@chakra-ui/icons";
import MailButtonMobile from "./MailButtonMobile";
import FishActionButtons from "./FishActionButtons";
import MarketButton from "./MarketButton";
import PoolRankButton from "./PoolRankButton";
import UserSkillsButton from "./UserSkillsButton";

let socket = null;

function PlaygroundMobile() {
    const [fishList, setFishList] = useState([]);
    const [fishMap, setFishMap] = useState({});
    const [showFish, setShowFish] = useState(null);
    const [fishParkingList, setFishParkingList] = useState([]);
    const [asset, setAsset] = useState({exp: 0, level: 0, gold: 0});
    const [baseInfo, setBaseInfo] = useState({username: ''});
    const [needPull, setNeedPull] = useState(false);
    const [needDestroyFish, setNeedDestroyFish] = useState(null);
    const toast = useToast()
    const [parkingEffect, setParkingEffect] = useState({});
    const [coldDownTrigger, setColdDownTrigger] = useState(false)
    const [userInfo, setUserInfo] = useState(null);
    const [godheadList, setGodheadList] = useState(null);

    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
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
    const expandParking = () => {
        ExpandFishParking((newParking) => {
            const index = fishParkingList.findIndex(p => p.parking === newParking.parking)
            if (index !== -1) {
                const newParkingList = [...fishParkingList]
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
        }, defaultFailedCallback).then()
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
    const refreshFishList = (fishes) => {
        if (fishes != null) {
            fishes.forEach(item => {
                if (item.fish.status === null || item.fish.status === undefined) {
                    item.fish.status = 0;
                }
            })
            setFishList(fishes);
        }
    }
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
        localStorage.removeItem('ts_ms');
        window.location.href = '/';
    };

    const handleCreateClick = () => {
        // 发送创建请求
        CreateFish((newFish) => {
            const newList = [...fishList];
            newList.push(newFish);
            setShowFish(newFish);
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
                    const newShowFish = {
                        ...fishList[index],
                        fish: newFish.fish,
                        rating: newFish.rating
                    };
                    newList[index] = newShowFish;
                    if (showFish !== null && newShowFish.fish.id === showFish.fish.id) {
                        setShowFish(newShowFish);
                    }
                }
            });
        }
        refreshFishList(newList);
    }
    useEffect(() => {
        if (coldDownTrigger) {
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
            setColdDownTrigger(false);
        }
    }, [coldDownTrigger, parkingEffect]);

    useEffect(() => {
        const cdInterval = setInterval(() => {
            setColdDownTrigger(true);
        }, 1000);
        return () => {
            clearInterval(cdInterval);
        }
    }, []);

    useEffect(() => {
        const newFishMap = {}
        const newParkingEffects = {}
        // console.log('refresh fish map: ' + fishList);
        fishList.forEach(item => {
            newFishMap[item.parking] = item;
            if (item.fish && Array.isArray(item.fish.effects)) {
                let idx = 0
                newParkingEffects[item.parking] = Array.of();
                const nowMs = new Date().getTime();
                for (let effect of item.fish.effects) {
                    if (Math.round((effect.effect_expire_ms - nowMs) / 1000) > 0) {
                        newParkingEffects[item.parking][idx] = {
                            ...effect
                        };
                        idx ++;
                    }
                }
            }

        })
        setParkingEffect(newParkingEffects);
        setFishMap(newFishMap);
    }, [fishList])

    useEffect(() => {
        if (needDestroyFish != null) {
            console.log(needDestroyFish);
            const destroyFish = (deadFish) => {
                const newFishList = [...fishList];
                const index = newFishList.findIndex(fish => fish.fish.id === deadFish.id);
                const oldFish = fishList[index];
                const df = {
                    fish : deadFish,
                    parking: oldFish.parking,
                    rating: oldFish.rating,
                }
                newFishList[index] = df;
                refreshFishList(newFishList);
                if (showFish.fish.id === df.fish.id) {
                    setShowFish(df);
                }
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
            PullFish(afterPull).then();
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
            FetchFishList((list) => {
                refreshFishList(list);
                if (list.length > 0) {
                    setShowFish(list[0])
                }
            }, defaultFailedCallback).then();
            FetchUserAsset(setAsset, defaultFailedCallback).then();
            FetchUserBaseInfo(setBaseInfo, defaultFailedCallback).then();
            FetchGodheadList(defaultFailedCallback, setGodheadList).then();
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
    return (<VStack>
        <Modal
            onClose={() => {}}
            size='full'
            isOpen={true}
            closeOnOverlayClick={false}
            scrollBehavior='inside'>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader maxH={50}>
                    <Grid zIndex={200} templateColumns='repeat(60, 1fr)'>
                        <GridItem colSpan={6}>
                            <MailButtonMobile/>
                        </GridItem>
                        <GridItem colSpan={49}>
                            {userInfo && (<UserBaseInfoMobile info={userInfo}/>)}
                        </GridItem>
                        <GridItem colSpan={5}>
                            <IconButton mt={-1} variant='ghost' maxW='50px' isRound aria-label='refresh' icon={<RepeatIcon color='teal.500'/>} onClick={() => {
                                window.location.reload();
                            }}/>
                        </GridItem>
                    </Grid>
                </ModalHeader>
                <ModalBody>
                    <Grid templateColumns='repeat(24, 1fr)' alignItems='center'>
                        <GridItem colSpan={24}>
                            {showFish != null && (<Card
                                zIndex={1}
                                className={FishCardClassNameByStatus(showFish.fish.status)}
                                mt={2}
                                bg={GetFishColorByRating(showFish.rating)}
                                padding={1}>
                                <CardHeader>
                                    <FishHeaderMobile fish={showFish.fish} effectList={parkingEffect[showFish.parking]}/>
                                </CardHeader>
                                <CardBody mt={-8}>
                                    <FishBaseInfoMobile fish={showFish.fish}/>
                                </CardBody>
                                <FishActionButtons fish={showFish.fish} fishList={fishList} asset={asset} fishParkingList={fishParkingList} refreshFishList={refreshFishList} setFishParkingList={setFishParkingList} setAsset={setAsset} defaultFailedCallback={defaultFailedCallback}/>
                            </Card>)}
                            <SimpleGrid mt={2} columns={3} gap={2}>
                                {Array.isArray(fishParkingList) && fishParkingList.filter(fp => fp.status !== 0).map(fishParking => (
                                    <GridItem colSpan={1} rowSpan={1} key={fishParking.parking}>
                                        {fishMap[fishParking.parking] != null && (<Button
                                                className={FishCardClassNameByStatus(fishMap[fishParking.parking].fish.status)}
                                                size='lg'
                                                height='100%'
                                                padding={1}
                                                onClick={() => setShowFish(fishMap[fishParking.parking])}
                                                colorScheme={GetFishColorByRatingMobile(fishMap[fishParking.parking].rating)}>
                                                <Grid templateColumns='repeat(1, 1fr)'>
                                                    <GridItem align='center'>
                                                        <FishStatusIcon status={fishMap[fishParking.parking].fish.status}
                                                                        boxSize='30px'/>
                                                    </GridItem>
                                                    <GridItem alignItems='center'>
                                                        <Text fontSize={13}>{fishMap[fishParking.parking].fish.name}</Text>
                                                    </GridItem>
                                                    <GridItem>
                                                        <Progress
                                                            mt={1}
                                                            size='sm'
                                                            value={fishMap[fishParking.parking].fish.heal < 0 ? 0 : fishMap[fishParking.parking].fish.heal * 100 / fishMap[fishParking.parking].fish.max_heal}
                                                            max={100}
                                                            colorScheme={GetHpProgressColor(fishMap[fishParking.parking].fish.heal, fishMap[fishParking.parking].fish.max_heal)}
                                                            isAnimated={true}/>
                                                    </GridItem>
                                                </Grid>
                                            </Button>
                                        )}
                                        {(!Array.isArray(fishList) || fishList.findIndex(oldFish => oldFish.parking === fishParking.parking) === -1) && (
                                            <Button
                                                size='lg'
                                                height='100%'
                                                isDisabled={fishParking.status === 1}
                                                colorScheme={GetParkingStatusColorMobile(fishParking.status)}
                                                onClick={expandParking}
                                                padding={1}>
                                                <Grid templateColumns='repeat(1, 1fr)'>
                                                    <GridItem align='center'>
                                                        {fishParking.status === 0 && (
                                                            <Text fontSize={40} textAlign='center'>拓</Text>)}
                                                        {fishParking.status === 1 && (
                                                            <Text fontSize={40} textAlign='center'>空</Text>)}
                                                    </GridItem>
                                                </Grid>
                                            </Button>
                                        )}
                                    </GridItem>))}
                                {Array.isArray(fishParkingList) && fishParkingList.findIndex(fishParking => fishParking.status === 0) !== -1 && (
                                    <GridItem colSpan={1} rowSpan={1}>
                                        <Button
                                            size='lg'
                                            height='100%'
                                            colorScheme='teal'
                                            onClick={expandParking}
                                            padding={1}>
                                            <Grid templateColumns='repeat(1, 1fr)'>
                                                <GridItem align='center'>
                                                    <Text fontSize={40} textAlign='center'>拓</Text>
                                                </GridItem>
                                            </Grid>
                                        </Button>
                                    </GridItem>)}
                            </SimpleGrid>
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <HStack gap={4} align='center'>
                        <IconButton aria-label='创建' onClick={handleCreateClick} icon={<Image src={createIcon}/>}/>
                        <PoolRankButton buttonFunc={(onOpen) => (<IconButton aria-label='排行' onClick={onOpen} icon={<Image src={poolRankIcon}/>}/>)}/>
                        <PropListButton columns={4} pageSize={12} incrExp={incrExp} buttonFunc={(onOpen) => (<IconButton aria-label='背包' onClick={onOpen} icon={<Image src={propsIcon}/>}/>)} />
                        <MarketButton buttonFunc={(onOpen) => (<IconButton aria-label='交易' onClick={onOpen} icon={<Image src={marketIcon}/>}/>)}/>
                        <UserSkillsButton fishList={fishList} asset={asset} setAsset={setAsset} buttonFunc={(onOpen) => (<IconButton aria-label='技能' onClick={onOpen} icon={<Image src={skillsIcon}/>}/>)}/>
                        <IconButton aria-label='建筑' icon={<Image src={buildingIcon}/>}/>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </VStack>);
}

export default PlaygroundMobile;