import {
    Badge,
    Box,
    Grid,
    GridItem,
    Heading,
    HStack, IconButton,
    Image,
    Link, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader,
    PopoverTrigger,
    Progress,
    Text,
    Tooltip, useDisclosure, VStack
} from "@chakra-ui/react";
import FishGodhead from "./FishGodhead";
import FishDeadRecordsTrigger from "./FishDeadRecordsTrigger";
import FishStatusIcon from "./FishStatusIcon";
import ProtectCountIcon from "../assets/fish/protect_count.svg";
import {FishEffectIconByEffectType} from "../style/StyleUtil";
import {GetHpProgressColor} from "../style/ColorUtil";
import React from "react";
import {GetGrowthRequireMoney} from "../pkg/FishUtils";

function FishHeader({fish, effectList}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {moneyIsOpen, moneyOnOpen, moneyOnClose} = useDisclosure();
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
                    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
                        <PopoverTrigger>
                            <Image onClick={onOpen} maxW='30px' src={ProtectCountIcon}/>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverHeader>保护中~</PopoverHeader>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody>
                                成长{fish.protect_count}次后结束保护
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
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
            <Popover isOpen={moneyIsOpen} onOpen={moneyOnOpen} onClose={moneyOnClose} placement='bottom-end'>
                <PopoverTrigger>
                    <Box onClick={moneyOnOpen}>
                        <Progress
                            value={fish.money}
                            max={GetGrowthRequireMoney(fish.level)}
                            size='sm'
                            mt={1}/>
                        <Text fontSize={10}>灵气：{fish.money}/{GetGrowthRequireMoney(fish.level)}</Text>
                    </Box>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader>来源</PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Text fontSize={13}>
                            <Badge>自然增长</Badge>{fish.fish_statistics.earn_detail[0]}
                        </Text>
                        <Text fontSize={13}>
                            <Badge>击杀</Badge>{fish.fish_statistics.earn_detail[1]}
                        </Text>
                        <Text fontSize={13}>
                            <Badge>技能</Badge>{fish.fish_statistics.earn_detail[3]}
                        </Text>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    )
}

export default FishHeader;