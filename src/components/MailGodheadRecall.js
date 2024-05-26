import {Box, Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure} from "@chakra-ui/react";
import GodheadPropRecall from "./GodheadPropsRecall";

function MailGodheadRecall({receiverUid, columns, recallCallback, isDisabled}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (<Box>
        <Button isDisabled={isDisabled} colorScheme='teal' onClick={onOpen}>归还</Button>
        <Modal isOpen={isOpen} onClose={onClose} maxH='100%'>
            <ModalContent>
                <ModalHeader>
                    选择归还的神格
                </ModalHeader>
                <ModalBody>
                    <GodheadPropRecall columns={columns} receiverUid={receiverUid} recallCallback={recallCallback} />
                </ModalBody>
            </ModalContent>
        </Modal>
    </Box>)
}

export default MailGodheadRecall;