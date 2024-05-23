import {Avatar, Box, HStack, Progress, Stack, Text} from "@chakra-ui/react";
import React from "react";
import UserGodhead from "./UserGodhead";
import {GetUserLevelUpRequired} from "../pkg/UserUtils";
import {GetUserCardColor} from "../style/ColorUtil";

function UserBaseInfo({info}) {
    return (
        <Box color="gray.50" bg={GetUserCardColor(info.level)} maxW={300} align='start' borderRadius='md' padding={3}>
            <HStack>
                <Avatar name={info.username} />
                <Box align='start'>
                    <Text fontSize={14} fontWeight="bold">{info.username}</Text>
                    <HStack fontSize={12} fontWeight="bold">
                        <Text>
                            等级: {info.level}
                        </Text>
                        <Text>
                            晶石: {info.gold}
                        </Text>
                    </HStack>
                    <Stack align='start'>
                        <UserGodhead godheadInfo={info.godhead}/>
                    </Stack>
                </Box>
            </HStack>
            <Box mt={info.godhead ? 0: 1}>
                <Progress
                    value={info.exp < 0 ? 0 : info.exp}
                    max={GetUserLevelUpRequired(info.level)}/>
            </Box>
            <HStack align='start'>
                <Box maxW='100%'>
                    <Text fontSize={10} fontWeight="bold">
                       经验：{info.exp < 0 ? 0 : info.exp}/{GetUserLevelUpRequired(info.level)}
                    </Text>
                </Box>
            </HStack>
        </Box>

    );
}

export default UserBaseInfo;