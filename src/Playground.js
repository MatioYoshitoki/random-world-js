import React, {useEffect, useState} from 'react';
import './Playground.css'
import './Market.css'
import {v4 as uuidv4} from 'uuid'; // 引入 uuid 库
import {
    BASE_WS_ENDPOINT,
} from './config';
import Market from "./Market"; // 导入配置文件
import {
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
    FormControl,
    FormLabel,
    RadioGroup,
    HStack,
    Radio,
    FormHelperText,
    NumberDecrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    Tooltip,
    UnorderedList,
    ListItem,
    Progress, Tabs, TabList, Tab, TabPanels, TabPanel, Flex, Spacer, Image, useToast,
} from '@chakra-ui/react'
import PropList from "./Props";
import PoolRank from "./PoolRank";
import {AddIcon, LockIcon} from "@chakra-ui/icons";
import {DecodeBase64} from "./Base64.js";
import {SellStart, SellStop} from "./request/Market";
import {
    AliveFish,
    CreateFish,
    FetchFishList,
    FetchFishParkingList,
    PullFish,
    RefineFish,
    SleepFish
} from "./request/Fish";
import {ExpandFishParking, FetchUserAsset, FetchUserBaseInfo} from "./request/User";
import {
    GetFishColorByRating,
    GetFishSkillColor,
    GetHpProgressColor,
    GetParkingStatusColor
} from "./style/ColorUtil";
import UserBaseInfo from "./UserBaseInfo";
import FishStatusIcon from "./FishStatusIcon";
import {FishCardClassNameByStatus, FishEffectIconByEffectType} from "./style/StyleUtil";
import UserLevelRank from "./UserLevelRank";
import UserSkills from "./UserSkills";
import {FailedToast, SuccessToast} from "./style/ShowToast";
import ProtectCountIcon from "./assets/fish/protect_count.svg";

let socket = null;

function Playground() {
    const [fishList, setFishList] = useState([]);
    const [fishMap, setFishMap] = useState({});
    const [fishParkingList, setFishParkingList] = useState([]);
    const [asset, setAsset] = useState({exp: 0, level: 0, gold: 0});
    const [baseInfo, setBaseInfo] = useState({username: ''});
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [marketOpen, setMarketOpen] = useState(false);
    const [propOpen, setPropOpen] = useState(false);
    const [userSkillsOpen, setUserSkillsOpen] = useState(false);
    const [sellFish, setSellFish] = useState(null);
    const [downSellFish, setDownSellFish] = useState(null);
    const [poolRankOpen, setPoolRankOpen] = useState(false);
    const [refineFishId, setRefineFishId] = useState(0);
    const [price, setPrice] = useState(0);
    const [sellDuration, setSellDuration] = useState('half_day');
    const [needPull, setNeedPull] = useState(false);
    const [needDestroyFish, setNeedDestroyFish] = useState(null)
    const toast = useToast()
    const [parkingEffect, setParkingEffect] = useState({});

    const [coldDownTriger, setColdDownTriger] = useState(false)
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

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
            setFishList(fishes);
        }
    }
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('uid');
        localStorage.removeItem('ts_ms');
        window.location.href = '/';
    };

    const handleSellClickOpen = async (fish) => {
        setSellFish(fish);
        onOpen();
    }

    const handleDownSellClickOpen = async (fish) => {
        setDownSellFish(fish);
        onOpen();
    }

    const handleOpenMarket = () => {
        setMarketOpen(true);
        onOpen();
    }

    const handleOpenProps = () => {
        setPropOpen(true);
        onOpen();
    }
    const handleOpenUserSkills = () => {
        setUserSkillsOpen(true);
        onOpen();
    }
    const handleOpenPoolRank = () => {
        setPoolRankOpen(true);
        onOpen();
    }
    const closeTopModal = () => {
        setMarketOpen(false);
        setPropOpen(false);
        setPoolRankOpen(false);
        setRefineFishId(0)
        setSellFish(null);
        setUserSkillsOpen(false);
        setDownSellFish(null);
        setPrice(0);
        setSellDuration('0');
        onClose()
    }

    const handleSleepClick = (fishId) => {
        // 发送休息请求
        SleepFish(fishId, defaultFailedCallback, () => {
            const newFishList = [...fishList]
            for (let i = 0; i < newFishList.length; i++) {
                if (newFishList[i].id === fishId) {
                    newFishList[i] = {
                        ...newFishList[i],
                        status: 1,
                    }
                    break;
                }
            }
            refreshFishList(newFishList)
        }).then();
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

    const handleRefineClick = (fishId) => {
        // 发送炼化请求
        setRefineFishId(fishId);
        onOpen();
    };

    const refine = (fishId) => {
        // 发送炼化请求
        RefineFish(fishId, defaultFailedCallback, () => {
            const newFishList = fishList.filter(fish => fish.id !== fishId);
            const newParkingList = [...fishParkingList];
            for (let fish of fishList) {
                if (fish.id === fishId) {
                    for (let parking of newParkingList) {
                        if (parking.parking === fish.parking) {
                            parking.status = 1;
                        }
                    }
                }
            }
            setFishParkingList(newParkingList);
            refreshFishList(newFishList);
            closeTopModal();
        }).then();
    };

    const handleAliveClick = (fishId) => {
        // 发送休息请求
        AliveFish(fishId, defaultFailedCallback, () => {
            const newFishList = [...fishList]
            for (let i = 0; i < newFishList.length; i++) {
                if (newFishList[i].id === fishId) {
                    newFishList[i] = {
                        ...newFishList[i],
                        status: 0,
                    }
                    break;
                }
            }
            refreshFishList(newFishList)
        }).then();
    };

    const renderActionButtons = (fish) => {
        switch (fish.status) {
            case 0:
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='yellow.50' onClick={() => handleSleepClick(fish.id)}>休息</Button>
                </Stack>);
            case 1:
                return (
                    <Stack mt={3} direction='row' spacing={4} align='center'>
                        <Button bg='green.100'
                                onClick={() => handleAliveClick(fish.id)}>激活</Button>
                        <Button bg='cyan.50' onClick={() => handleSellClickOpen(fish)}>上架</Button>
                        <Button bg='orange.100' onClick={() => handleRefineClick(fish.id)}>炼化</Button>
                    </Stack>
                );
            case 2:
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='blue.200' onClick={() => handleDownSellClickOpen(fish)}>下架</Button>
                </Stack>);
            case 3:
                return (
                    <Stack mt={3} direction='row' spacing={4} align='center'>
                        <Button bg='orange.100' onClick={() => handleRefineClick(fish.id)}>炼化</Button>
                    </Stack>
                );
            default:
                return null;
        }
    }
    const afterPull = (pullList) => {
        const newList = [...fishList];
        if (Array.isArray(pullList)) {
            pullList.forEach(newFish => {
                const index = newList.findIndex(oldFish => oldFish.id === newFish.id);
                if (index !== -1) {
                    newList[index] = {
                        ...fishList[index],
                        weight: newFish.weight,
                        level: newFish.level,
                        max_heal: newFish.max_heal,
                        heal: newFish.heal,
                        recover_speed: newFish.recover_speed,
                        atk: newFish.atk,
                        def: newFish.def,
                        earn_speed: newFish.earn_speed,
                        dodge: newFish.dodge,
                        money: newFish.money,
                        protect_count: newFish.protect_count,
                        awaking_remain: newFish.awaking_remain,
                        fish_skills: newFish.fish_skills,
                        fish_statistics: newFish.fish_statistics,
                        effects: newFish.effects,
                    };
                }
            });
        }
        refreshFishList(newList);
    }
    useEffect(() => {
        const newFishMap = {}
        const newParkingEffects = {}
        // console.log('refresh fish map: ' + fishList);
        fishList.forEach(item => {
            newFishMap[item.parking] = item;
            if (Array.isArray(item.effects)) {
                let idx = 0
                newParkingEffects[item.parking] = Array.of();
                const nowMs = new Date().getTime()
                for (let effect of item.effects) {
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
                const index = newFishList.findIndex(fish => fish.id === deadFish.id);
                const oldFish = fishList[index];
                newFishList[index] = {
                    ...deadFish,
                    parking: oldFish.parking,
                    rating: oldFish.rating,
                    level: oldFish.level,
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
                console.log(message);
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
        FetchFishParkingList(setFishParkingList, defaultFailedCallback).then();
        FetchFishList(refreshFishList, defaultFailedCallback).then();
        FetchUserAsset(setAsset, defaultFailedCallback).then();
        FetchUserBaseInfo(setBaseInfo, defaultFailedCallback).then();
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
                <UserBaseInfo asset={asset} userBaseInfo={baseInfo}/>
                <Grid templateRows='repeat(2, 1fr)'
                      templateColumns='repeat(3, 1fr)'
                      gap={10}
                      padding={10}
                >
                    {Array.isArray(fishParkingList) && fishParkingList.filter(fp => fp.status !== 0).map(fishParking => (
                        <GridItem colSpan={1} rowSpan={1} key={fishParking.parking}>
                            {fishMap[fishParking.parking] != null && (
                                <Card
                                    className={FishCardClassNameByStatus(fishMap[fishParking.parking].status)}
                                    bg={GetFishColorByRating(fishMap[fishParking.parking].rating)}
                                    height='100%'
                                    padding={5}>
                                    <CardHeader>
                                        <Flex>
                                            <Heading>
                                                {fishParking.parking + ': ' + fishMap[fishParking.parking].name}
                                            </Heading>
                                            {fishMap[fishParking.parking].protect_count > 0 &&
                                                <Tooltip
                                                    label={'保护中~(成长' + fishMap[fishParking.parking].protect_count + '次后结束保护)'}
                                                    placement='bottom'>
                                                    <Image mt={-5} maxW='25px' src={ProtectCountIcon}/>
                                                </Tooltip>
                                            }
                                            <Spacer />
                                            <FishStatusIcon status={fishMap[fishParking.parking].status} boxSize='50px'/>
                                        </Flex>
                                        <HStack>
                                            {Array.isArray(parkingEffect[fishParking.parking]) && (parkingEffect[fishParking.parking].map(effect => (
                                                <Tooltip label={effect.name+'('+Math.round((effect.effect_expire_ms - new Date().getTime()) / 1000)+'秒)'} placement='bottom'>
                                                    <Image maxW='30px' src={FishEffectIconByEffectType(effect.effect_type)}/>
                                                </Tooltip>
                                            )))}
                                        </HStack>
                                    </CardHeader>
                                    <CardBody>
                                        <Progress
                                            value={fishMap[fishParking.parking].heal < 0 ? 0 : fishMap[fishParking.parking].heal}
                                            max={fishMap[fishParking.parking].max_heal}
                                            colorScheme={GetHpProgressColor(fishMap[fishParking.parking].heal, fishMap[fishParking.parking].max_heal)}
                                            isAnimated={true}/>
                                        <Text>生命：{fishMap[fishParking.parking].heal < 0 ? 0 : fishMap[fishParking.parking].heal}/{fishMap[fishParking.parking].max_heal}</Text>
                                        <Text>境界：{fishMap[fishParking.parking].level}</Text>
                                        <Text>性格：{fishMap[fishParking.parking].personality_name}</Text>
                                        <Text>自愈：{fishMap[fishParking.parking].recover_speed}</Text>
                                        <Text>攻击：{fishMap[fishParking.parking].atk}</Text>
                                        <Text>防御：{fishMap[fishParking.parking].def}</Text>
                                        <Text>修炼：{fishMap[fishParking.parking].earn_speed}</Text>
                                        <Text>闪避：{fishMap[fishParking.parking].dodge}</Text>
                                        <Tooltip label={'自然增长: '+fishMap[fishParking.parking].fish_statistics.earn_detail[0] + '\n击杀：'+fishMap[fishParking.parking].fish_statistics.earn_detail[1] + '\n技能：'+fishMap[fishParking.parking].fish_statistics.earn_detail[3]} placement='left'>
                                            <Text>灵气：{fishMap[fishParking.parking].money}</Text>
                                        </Tooltip>
                                        <Tooltip label={'主动攻击: '+fishMap[fishParking.parking].fish_statistics.proactive_attack_count + '\t反击：'+fishMap[fishParking.parking].fish_statistics.counter_attack_count} placement='left'>
                                            <Text width='30%'>击杀数：{fishMap[fishParking.parking].fish_statistics.kills}</Text>
                                        </Tooltip>
                                        <Tooltip label={'剩余觉醒次数:' + fishMap[fishParking.parking].awaking_remain}
                                                 placement='left'>
                                            <Text width='15%'>技能：</Text>
                                        </Tooltip>
                                        <UnorderedList width='30%'>
                                            {Array.isArray(fishMap[fishParking.parking].fish_skills) && fishMap[fishParking.parking].fish_skills.map(fishSkill => (
                                                <ListItem key={fishSkill.skill_id}>
                                                    <Tooltip label={fishSkill.skill_desc} placement='left'>
                                                        <Text
                                                            textColor={GetFishSkillColor(fishSkill.skill_level)}>{fishSkill.skill_name}(Lv.{fishSkill.skill_level})</Text>
                                                    </Tooltip>
                                                </ListItem>
                                            ))}
                                        </UnorderedList>
                                        {!Array.isArray(fishMap[fishParking.parking].fish_skills) &&
                                            <Text>暂未觉醒技能</Text>}

                                    </CardBody>
                                    {renderActionButtons(fishMap[fishParking.parking])}
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
                    {userSkillsOpen && (
                        <ModalContent>
                            <UserSkills userLevel={asset.level} fishList={fishList} expendGold={(cost) => {
                                const newAsset = {
                                    ...asset
                                };
                                newAsset.gold = asset.gold - cost
                                setAsset(newAsset);
                            }}/>
                        </ModalContent>
                    )}
                    {propOpen && (
                        <ModalContent>
                            <PropList incrExp={(exp, levelUpCount) => {
                                const newAsset = {
                                    ...asset
                                };
                                newAsset.exp = asset.exp + exp
                                if (levelUpCount !== 0) {
                                    newAsset.level = newAsset.level + levelUpCount
                                    SuccessToast( '升级啦~ 增加经验' + exp + '！等级提升' + levelUpCount + '！', toast);
                                } else {
                                    SuccessToast( '增加经验' + exp + '！', toast);
                                }
                                setAsset(newAsset);
                            }}/>
                        </ModalContent>
                    )}
                    {poolRankOpen && (
                        <ModalContent>
                            <Tabs variant='enclosed'>
                                <TabList>
                                    <Tab>玩家等级榜</Tab>
                                    <Tab>🐟修为榜</Tab>
                                    <Tab>🐟击杀榜</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <UserLevelRank/>
                                    </TabPanel>
                                    <TabPanel>
                                        <PoolRank rankType={0}/>
                                    </TabPanel>
                                    <TabPanel>
                                        <PoolRank rankType={1}/>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </ModalContent>
                    )}
                    {sellFish != null && (
                        <ModalContent>
                            <Card padding={5}>
                                <CardHeader>
                                    <Heading>
                                        上架【{sellFish.name}】
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    <FormControl>
                                        <FormLabel>价格</FormLabel>
                                        <NumberInput defaultValue={price} min={0} onChange={(e) => setPrice(e)}>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper/>
                                                <NumberDecrementStepper/>
                                            </NumberInputStepper>
                                        </NumberInput>
                                        <FormHelperText>合理的价格可以让您的商品更受青睐</FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>上架时长</FormLabel>
                                        <RadioGroup defaultValue={sellDuration} onChange={(e) => setSellDuration(e)}>
                                            <HStack spacing='24px'>
                                                <Radio value='half_day'>半天</Radio>
                                                <Radio value='one_day'>一天</Radio>
                                                <Radio value='three_day'>三天</Radio>
                                                <Radio value='one_week'>一周</Radio>
                                            </HStack>
                                        </RadioGroup>
                                        <FormHelperText>注. 手续费取决于售价与上架时长</FormHelperText>
                                    </FormControl>
                                </CardBody>
                                <Stack direction='row'>
                                    <Button colorScheme='yellow'
                                            onClick={() => SellStart(sellFish, price, sellDuration, asset, (commission) => {
                                                SuccessToast('上架成功! 扣除手续费' + commission + '晶石', toast)
                                                setAsset({
                                                    ...asset,
                                                    gold: asset.gold - commission
                                                })
                                                closeTopModal();
                                                FetchFishParkingList(setFishParkingList, defaultFailedCallback).then();
                                                FetchFishList(refreshFishList, defaultFailedCallback).then();
                                            }, defaultFailedCallback)}>上架</Button>
                                    <Button colorScheme='red' onClick={closeTopModal}>取消</Button>
                                </Stack>
                            </Card>
                        </ModalContent>
                    )}
                    {downSellFish != null && (
                        <ModalContent>
                            <Card padding={5}>
                                <CardHeader>
                                    <Heading>
                                        下架【{downSellFish.name}】? 手续费将不退还。
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    <Stack direction='row'>
                                        <Button bg='blue.300' onClick={() => SellStop(downSellFish.id, () => {
                                            SuccessToast('下架成功', toast);
                                            closeTopModal();
                                            FetchFishParkingList(setFishParkingList, defaultFailedCallback).then();
                                            FetchFishList(refreshFishList, defaultFailedCallback).then();
                                        }, defaultFailedCallback)}>下架</Button>
                                        <Button colorScheme='red' onClick={closeTopModal}>取消</Button>
                                    </Stack>
                                </CardBody>
                            </Card>
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
            </GridItem>
            <GridItem colSpan={1} padding={3}>
                <Stack mt={90}>
                    <Button className="circle" onClick={handleCreateClick}>创建</Button>
                    <Button className="circle" onClick={handleOpenMarket}>交易</Button>
                    <Button className="circle" onClick={handleOpenPoolRank}>排行</Button>
                    <Button className="circle" onClick={handleOpenProps}>背包</Button>
                    <Button className="circle" onClick={handleOpenUserSkills}>技能</Button>
                    <Button className="circle">建筑</Button>
                    <Button className="circle" onClick={handleLogout}>退出</Button>
                </Stack>
            </GridItem>
        </Grid>
    );
}

export default Playground;