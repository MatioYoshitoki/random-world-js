import React, {useEffect, useState} from 'react';
import './Playground.css'
import './Market.css'
import {v4 as uuidv4} from 'uuid'; // 引入 uuid 库
import {
    BASE_WS_ENDPOINT,
} from './config';
import Market from "./Market"; // 导入配置文件
import {NotificationContainer, NotificationManager} from "react-notifications";
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
    Progress,
    Box, IconButton, Image,
} from '@chakra-ui/react'
import PropList from "./Props";
import PoolRank from "./PoolRank";
import {LockIcon} from "@chakra-ui/icons";
import {DecodeBase64} from "./Base64.js";
import {SellStart, SellStop} from "./request/Market";
import {
    AliveFish, CreateFish, FetchFishList, FetchFishParkingList, PullFish, RefineFish, SleepFish
} from "./request/Fish";
import {ExpandFishParking, FetchUserAsset, FetchUserBaseInfo} from "./request/User";
import {
    GetFishColorByRating,
    GetFishColorByRatingMobile,
    GetFishSkillColor,
    GetHpProgressColor,
    GetParkingStatusColorMobile
} from "./style/ColorUtil";
import UserBaseInfo from "./UserBaseInfo";
import FishStatusIcon from "./FishStatusIcon";
import {FishCardClassNameByStatus} from "./style/StyleUtil";

import buildingIcon from './assets/mobile_button_icon/building.svg';
import createIcon from './assets/mobile_button_icon/create.svg';
import marketIcon from './assets/mobile_button_icon/market.svg';
import skillsIcon from './assets/mobile_button_icon/skills.svg';
import poolRankIcon from './assets/mobile_button_icon/pool_rank.svg';
import propsIcon from './assets/mobile_button_icon/props.svg';
import PoolRankMobile from "./PoolRankMobile";

let socket = null;

function PlaygroundMobile() {
    const [fishList, setFishList] = useState([]);
    const [fishMap, setFishMap] = useState({});
    const [showFish, setShowFish] = useState({});
    const [fishParkingList, setFishParkingList] = useState([]);
    const [asset, setAsset] = useState({exp: 0, level: 0, gold: 0});
    const [baseInfo, setBaseInfo] = useState({username: ''});
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [marketOpen, setMarketOpen] = useState(false);
    const [propOpen, setPropOpen] = useState(false);
    const [sellFish, setSellFish] = useState(null);
    const [downSellFish, setDownSellFish] = useState(null);
    const [poolRankOpen, setPoolRankOpen] = useState(false);
    const [refineFishId, setRefineFishId] = useState(0);
    const [price, setPrice] = useState(0);
    const [sellDuration, setSellDuration] = useState('half_day');
    const [needPull, setNeedPull] = useState(false);
    const [needDestroyFish, setNeedDestroyFish] = useState(null)

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
        }).then()
    }

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
        setDownSellFish(null);
        setPrice(0);
        setSellDuration('0');
        onClose()
    }

    const handleSleepClick = (fishId) => {
        // 发送休息请求
        SleepFish(fishId, () => {
            const newFishList = [...fishList]
            for (let i = 0; i < newFishList.length; i++) {
                if (newFishList[i].id === fishId) {
                    const nf = {
                        ...newFishList[i], status: 1,
                    }
                    newFishList[i] = nf;
                    setShowFish(nf);
                    break;
                }
            }
            refreshFishList(newFishList)
        }).then();
    };
    const handleCreateClick = () => {
        // 发送休息请求
        CreateFish((newFish) => {
            const newList = [...fishList,];
            newList.push(newFish);
            refreshFishList(newList);
            FetchUserAsset(setAsset).then();
        }).then();
    };

    const handleRefineClick = (fishId) => {
        // 发送炼化请求
        setRefineFishId(fishId);
        onOpen();
    };

    const refine = (fishId) => {
        // 发送炼化请求
        RefineFish(fishId, () => {
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
        AliveFish(fishId, () => {
            const newFishList = [...fishList]
            for (let i = 0; i < newFishList.length; i++) {
                if (newFishList[i].id === fishId) {
                    const nf = {
                        ...newFishList[i], status: 0,
                    }
                    newFishList[i] = nf;
                    setShowFish(nf);
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
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='green.100'
                            onClick={() => handleAliveClick(fish.id)}>激活</Button>
                    <Button bg='cyan.50' onClick={() => handleSellClickOpen(fish)}>上架</Button>
                    <Button bg='orange.100' onClick={() => handleRefineClick(fish.id)}>炼化</Button>
                </Stack>);
            case 2:
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='blue.200' onClick={() => handleDownSellClickOpen(fish)}>下架</Button>
                </Stack>);
            case 3:
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='orange.100' onClick={() => handleRefineClick(fish.id)}>炼化</Button>
                </Stack>);
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
                    };
                }
            });
        }
        refreshFishList(newList);
    }
    useEffect(() => {
        const newFishMap = {}
        // console.log('refresh fish map: ' + fishList);
        fishList.forEach(item => {
            newFishMap[item.parking] = item;
        })
        // console.log(newFishMap)
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
                    ...deadFish, parking: oldFish.parking, rating: oldFish.rating, level: oldFish.level,
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
    })
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
    })

    useEffect(() => {
        FetchFishParkingList(setFishParkingList).then();
        FetchFishList((list) => {
            refreshFishList(list);
            if (list.length > 0) {
                console.log(list[0]);
                setShowFish(list[0])
            }
        }).then();
        FetchUserAsset(setAsset).then();
        FetchUserBaseInfo(setBaseInfo).then();
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

    return (<Box>
        <Grid templateColumns='repeat(24, 1fr)' alignItems='center'>
            <GridItem colSpan={24}>
                <UserBaseInfo asset={asset} userBaseInfo={baseInfo}/>
                {showFish != null && (<Card
                    className={FishCardClassNameByStatus(showFish.status)}
                    mt={2}
                    bg={GetFishColorByRating(showFish.rating)}
                    padding={3}>
                    <CardHeader mt={-5}>
                        <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                            <GridItem colSpan={3}>
                                <Heading>
                                    {showFish.parking + ': ' + showFish.name}
                                </Heading>
                            </GridItem>
                            <GridItem colStart={4} colEnd={5}>
                                {showFish.protect_count > 0 &&
                                    <Tooltip
                                        label={'保护中~(成长' + showFish.protect_count + '次后结束保护)'}
                                        placement='bottom'>
                                        <LockIcon color='pink.500' boxSize='2em'/>
                                    </Tooltip>
                                }
                            </GridItem>
                            <GridItem colStart={6} colEnd={8}>
                                <FishStatusIcon status={showFish.status} boxSize='40px'/>
                            </GridItem>
                        </Grid>
                    </CardHeader>
                    <CardBody mt={-8}>
                        <Progress
                            value={showFish.heal < 0 ? 0 : showFish.heal}
                            max={showFish.max_heal}
                            colorScheme={GetHpProgressColor(showFish.heal, showFish.max_heal)}
                            isAnimated={true}/>
                        <Text fontSize={13}>生命：{showFish.heal < 0 ? 0 : showFish.heal}/{showFish.max_heal}</Text>
                        <Text fontSize={13}>境界：{showFish.level}</Text>
                        <Text fontSize={13}>性格：{showFish.personality_name}</Text>
                        <Text fontSize={13}>自愈：{showFish.recover_speed}</Text>
                        <Text fontSize={13}>攻击：{showFish.atk}</Text>
                        <Text fontSize={13}>防御：{showFish.def}</Text>
                        <Text fontSize={13}>修炼：{showFish.earn_speed}</Text>
                        <Text fontSize={13}>闪避：{showFish.dodge}</Text>
                        {showFish.fish_statistics != null && (
                            <Tooltip
                                label={'自然增长: ' + showFish.fish_statistics.earn_detail[0] + '\n击杀：' + showFish.fish_statistics.earn_detail[1] + '\n技能：' + showFish.fish_statistics.earn_detail[3]}
                                placement='left'>
                                <Text fontSize={13}>灵气：{showFish.money}</Text>
                            </Tooltip>

                        )}
                        {showFish.fish_statistics != null &&
                            (<Tooltip
                                label={'主动攻击: ' + showFish.fish_statistics.proactive_attack_count + '\t反击：' + showFish.fish_statistics.counter_attack_count}
                                placement='left'>
                                <Text fontSize={13}>击杀数：{showFish.fish_statistics.kills}</Text>
                            </Tooltip>)}
                        <Tooltip label={'剩余觉醒次数:' + showFish.awaking_remain}
                                 placement='left'>
                            <Text fontSize={13}>技能：</Text>
                        </Tooltip>
                        <UnorderedList width='30%'>
                            {Array.isArray(showFish.fish_skills) && showFish.fish_skills.map(fishSkill => (
                                <ListItem key={fishSkill.skill_id}>
                                    <Tooltip label={fishSkill.skill_desc} placement='left'>
                                        <Text fontSize={13}
                                              textColor={GetFishSkillColor(fishSkill.skill_level)}>{fishSkill.skill_name}(Lv.{fishSkill.skill_level})</Text>
                                    </Tooltip>
                                </ListItem>
                            ))}
                        </UnorderedList>
                        {!Array.isArray(showFish.fish_skills) &&
                            <Text>暂未觉醒技能</Text>}

                    </CardBody>
                    {renderActionButtons(showFish)}
                </Card>)}
                <Grid templateRows='repeat(2, 1fr)'
                      templateColumns='repeat(3, 1fr)'
                      gap={3}
                      mt={-5}
                      padding={10}
                >
                    {Array.isArray(fishParkingList) && fishParkingList.filter(fp => fp.status !== 0).map(fishParking => (
                        <GridItem colSpan={1} rowSpan={1} key={fishParking.parking}>
                            {fishMap[fishParking.parking] != null && (<Button
                                    className={FishCardClassNameByStatus(fishMap[fishParking.parking].status)}
                                    size='lg'
                                    height='100%'
                                    padding={1}
                                    onClick={() => setShowFish(fishMap[fishParking.parking])}
                                    colorScheme={GetFishColorByRatingMobile(fishMap[fishParking.parking].rating)}>
                                    <Grid templateColumns='repeat(1, 1fr)'>
                                        <GridItem align='center'>
                                            <FishStatusIcon status={fishMap[fishParking.parking].status}
                                                            boxSize='30px'/>
                                        </GridItem>
                                        <GridItem alignItems='center'>
                                            <Text fontSize={13}>{fishMap[fishParking.parking].name}</Text>
                                        </GridItem>
                                        <GridItem>
                                            <Progress
                                                mt={1}
                                                size='sm'
                                                value={fishMap[fishParking.parking].heal < 0 ? 0 : fishMap[fishParking.parking].heal * 100 / fishMap[fishParking.parking].max_heal}
                                                max={100}
                                                colorScheme={GetHpProgressColor(fishMap[fishParking.parking].heal, fishMap[fishParking.parking].max_heal)}
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
                </Grid>
                <Modal
                    isOpen={isOpen}
                    onClose={closeTopModal}
                    isCentered
                    motionPreset='slideInBottom'
                    size='6xl'
                >
                    <ModalOverlay/>
                    {marketOpen && (<ModalContent>
                        <Market/>
                    </ModalContent>)}
                    {propOpen && (<ModalContent>
                        <PropList incrExp={(exp, levelUpCount) => {
                            const newAsset = {
                                ...asset
                            };
                            newAsset.exp = asset.exp + exp
                            if (levelUpCount !== 0) {
                                newAsset.level = newAsset.level + levelUpCount
                                NotificationManager.success('', '升级啦~ 增加经验' + exp + '！等级提升' + levelUpCount + '！');
                            } else {
                                NotificationManager.success('', '增加经验' + exp + '！');
                            }
                            setAsset(newAsset);
                        }}/>
                    </ModalContent>)}
                    {poolRankOpen && (<ModalContent maxWidth='90%'>
                        <PoolRankMobile/>
                    </ModalContent>)}
                    {sellFish != null && (<ModalContent>
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
                                        onClick={() => SellStart(sellFish, price, sellDuration, asset, setAsset, () => {
                                            closeTopModal();
                                            FetchFishParkingList(setFishParkingList).then();
                                            FetchFishList(refreshFishList).then();
                                        })}>上架</Button>
                                <Button colorScheme='red' onClick={closeTopModal}>取消</Button>
                            </Stack>
                        </Card>
                    </ModalContent>)}
                    {downSellFish != null && (<ModalContent>
                        <Card padding={5}>
                            <CardHeader>
                                <Heading>
                                    下架【{downSellFish.name}】? 手续费将不退还。
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack direction='row'>
                                    <Button bg='blue.300' onClick={() => SellStop(downSellFish.id, () => {
                                        closeTopModal();
                                        FetchFishParkingList(setFishParkingList).then();
                                        FetchFishList(refreshFishList).then();
                                    })}>下架</Button>
                                    <Button colorScheme='red' onClick={closeTopModal}>取消</Button>
                                </Stack>
                            </CardBody>
                        </Card>
                    </ModalContent>)}
                    {refineFishId !== 0 && (<ModalContent border={1}>
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
                    </ModalContent>)}
                </Modal>
                <NotificationContainer/>
            </GridItem>
        </Grid>
        <Stack className='bottom-element' direction='row' gap={4} align='center' padding={5}>
            <IconButton aria-label='创建' onClick={handleCreateClick} icon={<Image src={createIcon}/>}/>
            <IconButton aria-label='排行' onClick={handleOpenPoolRank} icon={<Image src={poolRankIcon}/>}/>
            <IconButton aria-label='背包' onClick={handleOpenProps} icon={<Image src={propsIcon}/>}/>
            <IconButton aria-label='交易' onClick={handleOpenMarket} icon={<Image src={marketIcon}/>}/>
            <IconButton aria-label='技能' icon={<Image src={skillsIcon}/>}/>
            <IconButton aria-label='建筑' icon={<Image src={buildingIcon}/>}/>
        </Stack>
    </Box>);
}

export default PlaygroundMobile;