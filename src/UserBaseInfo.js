import {Badge, Box, Stack, Text} from "@chakra-ui/react";
import React from "react";

function UserBaseInfo({asset, userBaseInfo}) {
    return (
        <Box ml='10' mt='2'>
            <Text fontSize={14} fontWeight="bold">{userBaseInfo.username}</Text>
            <Stack direction='row' alignItems='center'>
                <Text>
                    <Badge variant='solid' colorScheme='whatsapp'>
                        等级: {asset.level}
                    </Badge>
                </Text>
                <Text>
                    <Badge variant='solid' colorScheme='whatsapp'>
                        经验: {asset.exp}
                    </Badge>
                </Text>
                <Text>
                    <Badge variant='solid' colorScheme='whatsapp'>
                        晶石: {asset.gold}
                    </Badge>
                </Text>
            </Stack>
        </Box>

    );
}

export default UserBaseInfo;