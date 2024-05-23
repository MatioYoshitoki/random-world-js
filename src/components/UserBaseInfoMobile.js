import {
    Center,
    Divider,
    Link,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text, useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import UserBaseInfo from "./UserBaseInfo";

function UserBaseInfoMobile({info}) {
    const {isOpen, onOpen, onClose} = useDisclosure();

    return (
        <Center h='30px' gap={5} borderWidth='1px' borderRadius='lg'>
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
                <PopoverTrigger>
                    <Link fontWeight="bold" color='teal.500' fontSize={11}>{info.username}</Link>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverBody>
                        <UserBaseInfo info={info}/>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
            <Divider maxH='25px' orientation='vertical' />
            <Text color='green.300' fontSize={11}>等级: {info.level}</Text>
            <Divider maxH='25px' orientation='vertical' />
            <Text color='blue.300' fontSize={11}>晶石: {info.gold}</Text>
        </Center>
    );
}

export default UserBaseInfoMobile;