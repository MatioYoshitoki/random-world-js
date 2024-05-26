import React, {useState} from 'react';
import '../Login.css'
import {
    Box, Button,
    Link,
    Modal,
    ModalContent,
    ModalOverlay,
    Skeleton,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import {GetUserCard} from "../request/User";
import {FailedToast} from "../style/ShowToast";
import UserBaseInfo from "./UserBaseInfo";

function FishKiller({uid, fontSize, recallFishName}) {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState({
        username: '',
        level: 0,
        gold: 0,
        exp: 0,
        godhead: []
    });
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }
    const {isOpen, onOpen, onClose} = useDisclosure();

    const lookAt = (uid) => {
        setLoading(true);
        onOpen();
        GetUserCard(uid, (userInfo) => {
            userInfo.uid = uid;
            setInfo(userInfo);
            setLoading(false);
        }, defaultFailedCallback).then();
    }

    return (
        <Box>
            <Button colorScheme='red' fontSize={fontSize} onClick={() => lookAt(uid)}>击杀者</Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size='xs'
            >
                <ModalOverlay/>
                <ModalContent>
                    <Skeleton isLoaded={!loading}>
                        <UserBaseInfo maxW='100%' info={info} onlyShow={true} recallFishName={recallFishName}/>
                    </Skeleton>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default FishKiller;