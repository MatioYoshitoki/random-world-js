import React, {useState} from 'react';
import '../Login.css'
import {
    Box,
    Button,
    Card, CardBody, CardHeader, Center,
    Link, Modal, ModalBody, ModalContent, ModalOverlay, Popover, PopoverBody,
    PopoverContent,
    PopoverTrigger, Skeleton, Stack, useDisclosure,
    useToast
} from '@chakra-ui/react'
import {GetUserCard} from "../request/User";
import {FailedToast} from "../style/ShowToast";
import UserBaseInfo from "./UserBaseInfo";
import {GetFishColorByRating} from "../style/ColorUtil";
import FishHeader from "./FishHeader";
import FishBaseInfo from "./FishBaseInfo";

function UserClickDetails({uid, showText, fontSize}) {
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
            setInfo(userInfo);
            setLoading(false);
        }, defaultFailedCallback).then();
    }

    return (
        <Box>
            <Link fontWeight="bold" color='teal.500' fontSize={fontSize} onClick={() => lookAt(uid)}>{showText}</Link>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                size='xs'
            >
                <ModalOverlay/>
                <ModalContent>
                    <Skeleton isLoaded={!loading}>
                        <UserBaseInfo maxW='100%' info={info} onlyShow={true}/>
                    </Skeleton>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default UserClickDetails;