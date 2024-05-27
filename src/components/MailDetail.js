import {
    Box, Button, Image,
    Link,
    Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack,
    Highlight
} from "@chakra-ui/react";
import ExpPropIcon from "../assets/user_skills/refine_fish.svg";
import {GetGodheadIcon} from "../style/GodheadIconUtil";
import {useEffect, useState} from "react";
import MailGodheadRecall from "./MailGodheadRecall";

function MailDetail({title, message, pageSize, mail, readCallback, receiveCallback, recallCallback, deleteCallback}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const getPropIcon = (prop) => {
        if (prop.prop_type === 1001) {
            return ExpPropIcon;
        } else {
            return GetGodheadIcon(prop.extra.level);
        }
    }
    const readDetail = () => {
        readCallback();
        onOpen();
    }
    const [showText, setShowText] = useState(message);
    const [highLightText, setHighLightText] = useState([]);
    useEffect(() => {
        let newShowText = showText;
        const newHighLightText = [...highLightText];
        if (mail.extra !== undefined) {
            for (let key in mail.extra) {
                newShowText = newShowText.replace(`#{${key}}`, mail.extra[key]);
                newHighLightText.push(mail.extra[key]);
            }
        }
        setShowText(newShowText);
        setHighLightText(newHighLightText);
    }, [mail, message]);
    return (<Box>
        <Link fontSize={14} color='teal.500' onClick={readDetail}>{title}</Link>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    {title}
                </ModalHeader>
                <ModalBody>
                    <VStack align='end'>
                        <Text>
                            <Highlight
                                query={highLightText}
                                styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100', fontWeight: 'bold' }}
                            >
                                {showText}
                            </Highlight>
                        </Text>
                        {Array.isArray(mail.props) && mail.props.length > 0 && (
                            <VStack align='center'>
                                <Image maxW='40px' src={getPropIcon(mail.props[0])} />
                                <Text fontSize={10}>{mail.props[0].prop_name}</Text>
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    {Array.isArray(mail.props) && mail.props.length > 0 && (
                        <Button onClick={() => {
                            receiveCallback();
                            onClose();
                        }} colorScheme='whatsapp' isDisabled={mail.status === 2}>{mail.status === 2?'已领取':'领取'}</Button>
                    )}
                    {mail.mail_type === 0 && (
                        <MailGodheadRecall receiverUid={mail.sender_uid} columns={4} pageSize={pageSize} isDisabled={mail.status === 3} recallCallback={recallCallback}>归还</MailGodheadRecall>
                    )}
                    <Button isDisabled={Array.isArray(mail.props) && mail.props.length > 0 && mail.status !== 2} onClick={deleteCallback}>删除</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>)
}

export default MailDetail;