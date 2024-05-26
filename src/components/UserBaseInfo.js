import {Avatar, Box, Button, Flex, HStack, Progress, Spacer, Stack, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import UserGodhead from "./UserGodhead";
import {GetUserLevelUpRequired} from "../pkg/UserUtils";
import {GetUserCardColor} from "../style/ColorUtil";
import MailSender from "./MailSender";

function UserBaseInfo({maxW, info, onlyShow, recallFishName}) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (recallFishName !== undefined) {
            console.log(info);
            const recalled = localStorage.getItem('recall_show:'+recallFishName);
            if (recalled == null) {
                setShow(true);
            } else {
                setShow(false);
            }
        }
    }, [recallFishName]);
    return (
        <Box color="gray.50" bg={GetUserCardColor(info.level)} maxW={maxW} align='start' borderRadius='md' padding={3}>
            <HStack>
                <Avatar name={info.username} />
                <Box align='start'>
                    <Flex>
                        <Text fontSize={14} fontWeight="bold">{info.username}</Text>
                        <Spacer/>
                        {show && (
                            <MailSender maxW='45px' size='xs' fontSize={10} fontWeight='normal' colorScheme='teal' showText={'索要神格'} doAfterSend={() => {
                                localStorage.setItem('recall_show:'+recallFishName, '1');
                                setShow(false);
                            }} mail={{
                                receiverUid: info.uid,
                                mailType: 0,
                                propId: '',
                                extra: {
                                    request_fish_name: recallFishName,
                                }
                            }}/>
                        )}
                    </Flex>
                    <HStack fontSize={12} fontWeight="bold">
                        <Text>
                            等级: {info.level}
                        </Text>
                        <Text>
                            晶石: {info.gold}
                        </Text>
                    </HStack>
                    <Stack align='start'>
                        <UserGodhead godheadInfo={info.godhead} onlyShow={onlyShow}/>
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