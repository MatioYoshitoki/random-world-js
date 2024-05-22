import {Box, Grid, GridItem, Heading, HStack, Image, Progress, Text, Tooltip} from "@chakra-ui/react";
import Godhead from "./Godhead";
import FishDeadRecordsTrigger from "./FishDeadRecordsTrigger";
import FishStatusIcon from "./FishStatusIcon";
import ProtectCountIcon from "../assets/fish/protect_count.svg";
import {FishEffectIconByEffectType} from "../style/StyleUtil";
import {GetHpProgressColor} from "../style/ColorUtil";
import {GetGrowthRequireMoney} from "../pkg/FishUtils";
import React from "react";

function FishHeader({fish, effectList}) {
    return (
        <Box>
            <Grid templateColumns='repeat(10, 1fr)'>
                <GridItem colSpan={3}>
                    <Heading>
                        {fish.name}
                    </Heading>
                </GridItem>
                <GridItem colSpan={3}>
                    <Godhead godheadInfo={fish.godhead} fishId={fish.id} masterUid={fish.master_uid}/>
                </GridItem>
                <GridItem colSpan={2}></GridItem>
                <GridItem colSpan={1}>
                    {fish.status === 3 && <FishDeadRecordsTrigger fishId={fish.id}/>}
                </GridItem>
                <GridItem colSpan={1}>
                    <FishStatusIcon status={fish.status}
                                    boxSize='50px'/>
                </GridItem>
            </Grid>
            <HStack>
                {fish.protect_count > 0 &&
                    <Tooltip
                        label={'保护中~(成长' + fish.protect_count + '次后结束保护)'}
                        placement='bottom'>
                        <Image maxW='30px' src={ProtectCountIcon}/>
                    </Tooltip>
                }
                {Array.isArray(effectList) && (effectList.map(effect => (
                    <Tooltip
                        label={effect.name + '(' + Math.round((effect.effect_expire_ms - new Date().getTime()) / 1000) + '秒)'}
                        placement='bottom'>
                        <Image maxW='30px'
                               src={FishEffectIconByEffectType(effect.effect_type)}/>
                    </Tooltip>
                )))}
            </HStack>
            <Progress
                value={fish.heal < 0 ? 0 : fish.heal}
                max={fish.max_heal}
                mt={1}
                colorScheme={GetHpProgressColor(fish.heal, fish.max_heal)}/>
            <Text fontSize={13}>生命：{fish.heal < 0 ? 0 : fish.heal}/{fish.max_heal}</Text>
            <Tooltip label={'自然增长: '+fish.fish_statistics.earn_detail[0] + '\n击杀：'+fish.fish_statistics.earn_detail[1] + '\n技能：'+fish.fish_statistics.earn_detail[3]} placement='left'>
                <Box>
                    <Progress
                        value={fish.money}
                        max={GetGrowthRequireMoney(fish.level)}
                        size='sm'
                        mt={1}/>
                    <Text fontSize={13}>灵气：{fish.money}/{GetGrowthRequireMoney(fish.level)}</Text>
                </Box>
            </Tooltip>
        </Box>
    )
}

export default FishHeader;