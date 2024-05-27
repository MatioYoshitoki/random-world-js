import {
    Badge,
    Box, Button,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {FetchMailReceived, MailReceive, MailRemove} from "../request/Mail";
import {FailedToast, SuccessToast} from "../style/ShowToast";
import MailDetail from "./MailDetail";

function MailButton() {
    const [mailList, setMailList] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const toast = useToast();
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    const tryFetch = () => {
        const uid = localStorage.getItem('uid')
        const latestMailIdKey = 'mail_latest_mail_id:'+uid;
        let oldMailId = localStorage.getItem(latestMailIdKey);
        if (oldMailId == null || oldMailId === "undefined") {
            oldMailId = '0';
        }
        FetchMailReceived(oldMailId, afterFetchReceived, defaultFailedCallback).then();
    }
    useEffect(() => {
        tryFetch();
    }, []);

    useEffect(() => {
        // 每隔 3 秒发送 ask 消息
        const fetchInterval = setInterval(() => {
            tryFetch();
        }, 3000);
        return () => {
            clearInterval(fetchInterval);
        }
    }, [])
    const receive = (mailId) => {
        MailReceive(mailId, () => {
            const newMailList = mailList.map(item => {
                const newItem = {...item}
                if (item.mail_id === mailId) {
                    newItem.status = 2;
                }
                return newItem;
            })
            setMailList(newMailList);
            window.location.reload();
            SuccessToast('领取成功', toast);
        }, defaultFailedCallback).then();
    }

    const remove = (mailId) => {
        MailRemove(mailId, () => {
            SuccessToast('删除成功', toast);
        }, () => {}).then();
    }


    const afterFetchReceived = (list, latestMailId, oldMailId) => {
        const uid = localStorage.getItem('uid')
        const latestMailIdKey = 'mail_latest_mail_id:'+uid;
        const mailListKey = 'mail_list:'+uid;
        if (oldMailId !== latestMailId && latestMailId !== '0') {
            if (Array.isArray(list) && list.length !== 0) {
                localStorage.setItem(latestMailIdKey, latestMailId);
                const oldMailStr = localStorage.getItem(mailListKey);
                let oldMail = {};
                if (oldMailStr != null) {
                    oldMail = JSON.parse(oldMailStr);
                }
                for (let item of list) {
                    oldMail[item.mail_id] = {
                        ...item,
                        status: 0,
                    }
                }
                const oldMailList = [];
                let idx = 0;
                for (const key in oldMail) {
                    oldMailList[idx] = oldMail[key];
                    idx++;
                }
                setMailList(oldMailList);
            }
        } else {
            const oldMailStr = localStorage.getItem(mailListKey);
            if (oldMailStr != null) {
                const oldMail = JSON.parse(oldMailStr);
                const oldMailList = [];
                let idx = 0;
                for (const key in oldMail) {
                    oldMailList[idx] = oldMail[key];
                    idx++;
                }
                setMailList(oldMailList);
            }
        }
    }
    useEffect(() => {
        if (mailList.length > 0) {
            const uid = localStorage.getItem('uid')
            const mailListKey = 'mail_list:'+uid;
            const mm = {}
            let hu = false;
            for (let item of mailList) {
                mm[item.mail_id] = item;
                if (item.status === 0) {
                    hu = true;
                }
            }
            localStorage.setItem(mailListKey, JSON.stringify(mm));
            setHasUnread(hu);
        }
    }, [mailList]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const mailConfig = JSON.parse(localStorage.getItem('mail_message_template_configs'));
    return (<Box>
        <Button className={hasUnread?'mail-unread':''} colorScheme={hasUnread?'teal':'gray'} onClick={onOpen}>邮件</Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    信件
                </ModalHeader>
                <ModalBody>
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>标题</Th>
                                    <Th>发件人</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {Array.isArray(mailList) && mailList.map(mail => (
                                    <Tr key={mail.mail_id}>
                                        <Td>
                                            <HStack>
                                                {mail.status === 0 && (<Badge colorScheme='purple'>未读</Badge>)}
                                                {mail.status === 1 && (<Badge>已读</Badge>)}
                                                {mail.status === 2 && (<Badge>已领取</Badge>)}
                                                {mail.status === 3 && (<Badge>已归还</Badge>)}
                                                <MailDetail pageSize={20} mail={mail} title={mailConfig[mail.message_id].title} message={mailConfig[mail.message_id].message} readCallback={() => {
                                                    const newMailList = mailList.map(item => {
                                                        const newItem = {...item}
                                                        if (item.mail_id === mail.mail_id && mail.status === 0) {
                                                            newItem.status = 1;
                                                        }
                                                        return newItem;
                                                    })
                                                    setMailList(newMailList);
                                                }} receiveCallback={() => {
                                                    receive(mail.mail_id)
                                                }} deleteCallback={() => {
                                                    if (mail.mail_type === 1 && mail.status !== 2) {
                                                        FailedToast('道具还未领取', toast);
                                                        return
                                                    }
                                                    const newMailList = mailList.filter(item => item.mail_id !== mail.mail_id);
                                                    setMailList(newMailList);
                                                    if (newMailList.length === 0) {
                                                        const uid = localStorage.getItem('uid')
                                                        const mailListKey = 'mail_list:'+uid;
                                                        localStorage.removeItem(mailListKey);
                                                    }
                                                    if (mail.mail_type === 0) {
                                                        remove(mail.mail_id);
                                                    }
                                                }} recallCallback={() => {
                                                    const newMailList = mailList.map(item => {
                                                        const newItem = {...item}
                                                        if (item.mail_id === mail.mail_id) {
                                                            newItem.status = 3;
                                                        }
                                                        return newItem;
                                                    })
                                                    setMailList(newMailList);
                                                }}/>
                                            </HStack>
                                        </Td>
                                        <Td fontSize={12} fontWeight='bold'>{mail.sender_name}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </ModalBody>
            </ModalContent>
        </Modal>
    </Box>)
}

export default MailButton;