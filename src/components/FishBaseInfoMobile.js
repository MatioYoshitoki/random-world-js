import {Flex, Grid, GridItem, Progress, Text, Tooltip, VStack} from "@chakra-ui/react";
import {getFishLevelNameByLevel} from "../style/TextDisplayUtils";
import BehaviorDetails from "./BehaviorDetails";
import FishSkills from "./FishSkills";
import GrowthDetails from "./GrowthDetails";
import React from "react";
import {Position} from "../pkg/FishUtils";

function FishBaseInfoMobile({fish}) {
    return (<Grid templateColumns='repeat(10, 1fr)'>
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
                    (<Tooltip
                        label={'主动攻击: ' + fish.fish_statistics.proactive_attack_count + '\t反击：' + fish.fish_statistics.counter_attack_count}
                        placement='left'>
                        <Text fontSize={13}>击杀数：{fish.fish_statistics.kills}</Text>
                    </Tooltip>)}
                <FishSkills fishSkillList={fish.fish_skills} awakingRemain={fish.awaking_remain}/>
            </VStack>
        </GridItem>
        <GridItem colSpan={6}>
            <GrowthDetails fish={fish}/>
        </GridItem>
    </Grid>)
}

export default FishBaseInfoMobile;