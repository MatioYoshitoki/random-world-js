import {Badge, Box, HStack, Stack, Text, useToast} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import UserGodhead from "./UserGodhead";
import {FetchGodheadList} from "../request/User";
import {FailedToast} from "../style/ShowToast";

function UserBaseInfo({asset, userBaseInfo}) {
    const toast = useToast();
    const [userGodheadList, setUserGodheadList] = useState([])
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    useEffect(() => {
        FetchGodheadList(defaultFailedCallback, (list) => {
            setUserGodheadList(list);
        }).then();
    }, []);
    return (
        <Box ml='10' mt='2'>
            <HStack>
                <Text fontSize={14} fontWeight="bold">{userBaseInfo.username}</Text>
                <UserGodhead godheadInfo={userGodheadList}/>
            </HStack>
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