import React, {useEffect, useState} from 'react';
import '../Login.css'
import ReactPager from 'react-pager';
import {
    Link, Popover, PopoverBody,
    PopoverContent,
    PopoverTrigger, Skeleton,
    Table,
    TableCaption,
    TableContainer,
    Td,
    Th,
    Thead,
    Tr, useDisclosure,
    useToast
} from '@chakra-ui/react'
import {FetchUserLevelRanks, GetUserCard} from "../request/User";
import {FailedToast} from "../style/ShowToast";
import UserBaseInfo from "./UserBaseInfo";

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
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
            <PopoverTrigger>
                <Link fontWeight="bold" color='teal.500' fontSize={fontSize} onClick={() => lookAt(uid)}>{showText}</Link>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverBody>
                    <Skeleton isLoaded={!loading}>
                        <UserBaseInfo info={info} onlyShow={true}/>
                    </Skeleton>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default UserClickDetails;