import {
    Badge,
    Flex,
    Grid,
    GridItem,
    HStack,
    Link,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {getFishLevelNameByLevel} from "../style/TextDisplayUtils";
import BehaviorDetails from "./BehaviorDetails";
import FishSkills from "./FishSkills";
import GrowthDetails from "./GrowthDetails";
import React from "react";
import {Position} from "../pkg/FishUtils";

function FishBaseInfoMobile({fish}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (<VStack alignItems='start'>
            <Grid templateColumns='repeat(10, 1fr)'>
                <GridItem colSpan={4}>
                    <VStack alignItems='start'>
                        <Text fontSize={13}>境界：{getFishLevelNameByLevel(fish.level)}</Text>
                        <Flex>
                            <Text fontSize={13}>性格</Text>
                            <BehaviorDetails behavior={fish.behavior}/>
                            <Text fontSize={13}>：{Position(fish.personality_id)}</Text>
                        </Flex>
                        <Text fontSize={13}>自愈：{fish.recover_speed}</Text>
                        <Text fontSize={13}>攻击：{fish.atk}</Text>
                        <Text fontSize={13}>防御：{fish.def}</Text>
                        <Text fontSize={13}>修炼：{fish.earn_speed}</Text>
                        <Text fontSize={13}>闪避：{fish.dodge}</Text>
                        {fish.fish_statistics != null &&
                            (<Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
                                <PopoverTrigger>
                                    <Link fontSize={13} color='teal.500' onClick={onOpen}>击杀数：{fish.fish_statistics.kills}</Link>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverHeader fontWeight='semibold'>统计</PopoverHeader>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <VStack alignItems='start'>
                                            <HStack>
                                                <Badge>攻击</Badge>
                                                <Text fontWeight='bold'>{fish.fish_statistics.proactive_attack_count}</Text>
                                            </HStack>
                                            <HStack>
                                                <Badge>反击</Badge>
                                                <Text fontWeight='bold'>{fish.fish_statistics.counter_attack_count}</Text>
                                            </HStack>
                                        </VStack>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>)}
                    </VStack>
                </GridItem>
                <GridItem colSpan={6}>
                    <GrowthDetails fish={fish}/>
                </GridItem>
            </Grid>
            <FishSkills fontSize={13} fishSkillList={fish.fish_skills} awakingRemain={fish.awaking_remain}/>
    </VStack>
        )
}

export default FishBaseInfoMobile;