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

function FishBaseInfo({fish}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (<Grid templateColumns='repeat(10, 1fr)'>
        <GridItem colSpan={5}>
            <VStack alignItems='start'>
                <Text>境界：{getFishLevelNameByLevel(fish.level)}</Text>
                <Flex>
                    <Text>性格</Text>
                    <BehaviorDetails behavior={fish.behavior}/>
                    <Text>：{Position(fish.personality_id)}</Text>
                </Flex>
                <Text>自愈：{fish.recover_speed}</Text>
                <Text>攻击：{fish.atk}</Text>
                <Text>防御：{fish.def}</Text>
                <Text>修炼：{fish.earn_speed}</Text>
                <Text>闪避：{fish.dodge}</Text>
                {fish.fish_statistics != null &&
                    (<Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
                        <PopoverTrigger>
                            <Link color='teal.500' onClick={onOpen}>击杀数：{fish.fish_statistics.kills}</Link>
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
                <FishSkills fishSkillList={fish.fish_skills} awakingRemain={fish.awaking_remain}/>
            </VStack>
        </GridItem>
        <GridItem colSpan={5}>
            <VStack>
                <GrowthDetails fish={fish}/>
            </VStack>
        </GridItem>
    </Grid>)
}

export default FishBaseInfo;