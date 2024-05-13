import React, {useState, useEffect} from 'react';
import './Login.css'
import {Box, VStack, HStack, Button, Text, Image, Badge, Heading,} from '@chakra-ui/react'
import {FetchUserSkills, UserCrazyFish, UserSkillUpgrade} from "./request/User";
import CrazyFish from "./assets/user_skills/crazy_fish.svg";
import FeedFish from "./assets/user_skills/feed_fish.svg";
import HealFish from "./assets/user_skills/heal_fish.svg";
import RefineFish from "./assets/user_skills/refine_fish.svg";
import ShadowFish from "./assets/user_skills/shadow_fish.svg";
import SkillTargetSelector from "./SkillTargetSelector";

function UserSkills({userLevel, fishList}) {
    const [userSkills, setUserSkills] = useState([]);
    const [healFish, setHealFish] = useState({})
    const [feedFish, setFeedFish] = useState({})
    const [shadowFish, setShadowFish] = useState({})
    const [crazyFish, setCrazyFish] = useState({})
    const [refineFish, setRefineFish] = useState({})

    const [healFishCD, setHealFishCD] = useState(0)
    const [feedFishCD, setFeedFishCD] = useState(0)
    const [shadowFishCD, setShadowFishCD] = useState(0)
    const [crazyFishCD, setCrazyFishCD] = useState(0)
    const [refineFishCD, setRefineFishCD] = useState(0)

    const setColdDownSecond = (coldDownAtMs, callback) => {
        if (coldDownAtMs === 0) {
            callback(0);
        } else {
            callback(Math.round((coldDownAtMs - new Date().getTime()) / 1000));
        }
    }

    useEffect(() => {
        for (let skill of userSkills) {
            console.log(skill);
            switch (skill.id) {
                case 1:
                    setFeedFish(skill);
                    setColdDownSecond(skill.cold_down_at_ms, setFeedFishCD);
                    break;
                case 2:
                    setHealFish(skill);
                    setColdDownSecond(skill.cold_down_at_ms, setHealFishCD);
                    break;
                case 3:
                    setShadowFish(skill);
                    setColdDownSecond(skill.cold_down_at_ms, setShadowFishCD);
                    break;
                case 4:
                    setCrazyFish(skill);
                    setColdDownSecond(skill.cold_down_at_ms, setCrazyFishCD);
                    break;
                case 5:
                    setRefineFish(skill);
                    setColdDownSecond(skill.cold_down_at_ms, setRefineFishCD);
                    break;
            }
        }
    }, [userSkills])
    const enrichUserSkills = (skills) => {
        if (skills !== undefined) {
            console.log(skills);
            setUserSkills(skills);
        }
    };
    useEffect(() => {
        FetchUserSkills(enrichUserSkills).then();
    }, []);

    return (
        <VStack>
            <Heading>技能</Heading>
            <VStack padding={10} spacing={100}>
                <HStack spacing={150}>
                    <Box>
                        <VStack>
                            <Image maxH={50} maxW={50} src={FeedFish}/>
                            <Text
                                fontSize={14}>生灵术<Badge>Lv.{feedFish.level}</Badge>{feedFishCD !== 0 && <Badge colorScheme='green'>{feedFishCD}秒</Badge>}</Text>
                            <Text textAlign='center' maxW='150px' fontSize={12}>{feedFish.desc}</Text>
                            <HStack>
                                <Button maxW='60px' size='xs' colorScheme='blue'
                                        isDisabled={feedFish.upgrade_required_level > userLevel} onClick={() => UserSkillUpgrade(feedFish.id, () => FetchUserSkills(enrichUserSkills))}>升级</Button>
                                <Button maxW='60px' size='xs' colorScheme='whatsapp'
                                        isDisabled={feedFish.level <= 0}>使用</Button>
                            </HStack>
                            {feedFish.upgrade_required_level > userLevel && (
                                <Text fontSize={10}>人物等级达到{feedFish.upgrade_required_level}级解锁下一等级</Text>
                            )}
                            {feedFish.upgrade_required_level < userLevel && (
                                <Text fontSize={10}>升级需要消耗{feedFish.upgrade_required_gold}晶石</Text>
                            )}
                        </VStack>
                    </Box>
                    <Box>
                        <VStack>
                            <Image maxH={50} maxW={50} src={HealFish}/>
                            <Text fontSize={14}>急救术<Badge>Lv.{healFish.level}</Badge>{healFishCD !== 0 && <Badge colorScheme='green'>{healFishCD}秒</Badge>}</Text>
                            <Text textAlign='center' maxW='150px' fontSize={12}>{healFish.desc}</Text>
                            <HStack>
                                <Button maxW='60px' size='xs' colorScheme='blue'
                                        isDisabled={healFish.upgrade_required_level > userLevel} onClick={() => UserSkillUpgrade(healFish.id, () => FetchUserSkills(enrichUserSkills))}>升级</Button>
                                <Button maxW='60px' size='xs' colorScheme='whatsapp'
                                        isDisabled={healFish.level <= 0}>使用</Button>
                            </HStack>
                            {healFish.upgrade_required_level > userLevel && (
                                <Text fontSize={10}>人物等级达到{healFish.upgrade_required_level}级解锁下一等级</Text>
                            )}
                            {healFish.upgrade_required_level < userLevel && (
                                <Text fontSize={10}>升级需要消耗{healFish.upgrade_required_gold}晶石</Text>
                            )}
                        </VStack>
                    </Box>
                    <Box>
                        <VStack>
                            <Image maxH={50} maxW={50} src={ShadowFish}/>
                            <Text fontSize={14}>隐秘术<Badge>Lv.{shadowFish.level}</Badge>{shadowFishCD !== 0 && <Badge colorScheme='green'>{shadowFishCD}秒</Badge>}</Text>
                            <Text textAlign='center' maxW='150px' fontSize={12}>{shadowFish.desc}</Text>
                            <HStack>
                                <Button maxW='60px' size='xs' colorScheme='blue'
                                        isDisabled={shadowFish.upgrade_required_level > userLevel} onClick={() => UserSkillUpgrade(shadowFish.id, () => FetchUserSkills(enrichUserSkills))}>升级</Button>
                                <Button maxW='60px' size='xs' colorScheme='whatsapp'
                                        isDisabled={shadowFish.level <= 0}>使用</Button>
                            </HStack>
                            {shadowFish.upgrade_required_level > userLevel && (
                                <Text fontSize={10}>人物等级达到{shadowFish.upgrade_required_level}级解锁下一等级</Text>
                            )}
                            {shadowFish.upgrade_required_level < userLevel && (
                                <Text fontSize={10}>升级需要消耗{shadowFish.upgrade_required_gold}晶石</Text>
                            )}
                        </VStack>
                    </Box>
                </HStack>
                <HStack spacing={150}>
                    <Box>
                        <VStack>
                            <Image maxH={50} maxW={50} src={CrazyFish}/>
                            <Text fontSize={14}>狂暴术<Badge>Lv.{crazyFish.level}</Badge>{crazyFishCD !== 0 && <Badge ml={1} colorScheme='green'>{crazyFishCD}秒</Badge>}</Text>
                            <Text textAlign='center' maxW='150px' fontSize={12}>{crazyFish.desc}</Text>
                            <HStack>
                                <Button maxW='60px' size='xs' colorScheme='blue'
                                        isDisabled={crazyFish.upgrade_required_level > userLevel} onClick={() => UserSkillUpgrade(crazyFish.id, () => FetchUserSkills(enrichUserSkills))}>升级</Button>
                                <SkillTargetSelector fishList={fishList} isDisabled={crazyFish.level <= 0} targetStatus={0} callback={(fishId) => {
                                    console.log('crazy fish:'+fishId);
                                    UserCrazyFish(fishId, ( coldDownAtMs, durationAtMs) => {
                                        setColdDownSecond(coldDownAtMs, setCrazyFishCD);
                                    }).then();
                                }}/>
                            </HStack>
                            {crazyFish.upgrade_required_level > userLevel && (
                                <Text fontSize={10}>人物等级达到{crazyFish.upgrade_required_level}级解锁下一等级</Text>
                            )}
                            {crazyFish.upgrade_required_level < userLevel && (
                                <Text fontSize={10}>升级需要消耗{crazyFish.upgrade_required_gold}晶石</Text>
                            )}
                        </VStack>
                    </Box>
                    <Box>
                        <VStack>
                            <Image maxH={50} maxW={50} src={RefineFish}/>
                            <Text fontSize={14}>炼化术<Badge>Lv.{refineFish.level}</Badge>{refineFishCD !== 0 && <Badge colorScheme='green'>{refineFishCD}秒</Badge>}</Text>
                            <Text textAlign='center' maxW='150px' fontSize={12}>{refineFish.desc}</Text>
                            <HStack>
                                <Button maxW='60px' size='xs' colorScheme='blue'
                                        isDisabled={refineFish.upgrade_required_level > userLevel} onClick={() => UserSkillUpgrade(refineFish.id, () => FetchUserSkills(enrichUserSkills))}>升级</Button>
                            </HStack>
                            {refineFish.upgrade_required_level > userLevel && (
                                <Text fontSize={10}>人物等级达到{refineFish.upgrade_required_level}级解锁下一等级</Text>
                            )}
                            {refineFish.upgrade_required_level < userLevel && (
                                <Text fontSize={10}>升级需要消耗{refineFish.upgrade_required_gold}晶石</Text>
                            )}
                        </VStack>
                    </Box>
                </HStack>
            </VStack>
        </VStack>
    );
}

export default UserSkills;