import {Box, Grid, GridItem, Heading, HStack, Image, Progress, Text, VStack} from "@chakra-ui/react";
import FishGodhead from "./FishGodhead";
import FishDeadRecordsTrigger from "./FishDeadRecordsTrigger";
import FishStatusIcon from "./FishStatusIcon";
import ProtectCountIcon from "../assets/fish/protect_count.svg";
import {FishEffectIconByEffectType} from "../style/StyleUtil";
import React from "react";
import {GetHpProgressColor} from "../style/ColorUtil";
import {GetGrowthRequireMoney} from "../pkg/FishUtils";

function FishHeaderMobile({fish, effectList}) {
    const hpColor = GetHpProgressColor(fish.heal, fish.max_heal)
    console.log(hpColor);
    return (
        <Box>
            <Grid templateColumns='repeat(10, 1fr)'>
                <GridItem colSpan={3}>
                    <Heading>
                        {fish.name}
                    </Heading>
                </GridItem>
                <GridItem colSpan={3}>
                    <FishGodhead godheadInfo={fish.godhead} fishId={fish.id} masterUid={fish.master_uid}/>
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
                    <Image maxW='30px' src={ProtectCountIcon}/>
                }
                {Array.isArray(effectList) && (effectList.map(effect => (
                    <Image maxW='30px' src={FishEffectIconByEffectType(effect.effect_type)}/>
                )))}
            </HStack>
            <Box>
                <Progress
                    value={fish.heal < 0 ? 0 : fish.heal}
                    max={fish.max_heal}
                    colorScheme={hpColor}
                    isAnimated={true}/>
                <Text fontSize={10}>生命：{fish.heal < 0 ? 0 : fish.heal}/{fish.max_heal}</Text>
                <Progress
                    value={fish.money}
                    max={GetGrowthRequireMoney(fish.level)}
                    size='sm'
                    mt={1}/>
                <Text fontSize={10}>灵气：{fish.money}/{GetGrowthRequireMoney(fish.level)}</Text>
            </Box>
        </Box>
    )
}

export default FishHeaderMobile;