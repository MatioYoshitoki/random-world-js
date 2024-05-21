import {Flex, Grid, GridItem, Text, Tooltip, VStack} from "@chakra-ui/react";
import {getFishLevelNameByLevel} from "../style/TextDisplayUtils";
import BehaviorDetails from "./BehaviorDetails";
import FishSkills from "./FishSkills";
import GrowthDetails from "./GrowthDetails";
import React from "react";
import {Position} from "../pkg/FishUtils";

function FishBaseInfo({fish}) {
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
                <Tooltip label={'主动攻击: '+fish.fish_statistics.proactive_attack_count + '\t反击：'+fish.fish_statistics.counter_attack_count} placement='left'>
                    <Text>击杀数：{fish.fish_statistics.kills}</Text>
                </Tooltip>
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