import {
    Modal,
    ModalBody, ModalContent,
    ModalHeader, ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import React from "react";
import Market from "./Market";

function MarketButton({buttonFunc}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            {buttonFunc(onOpen)}
            <Modal isCentered isOpen={isOpen} onClose={onClose} size='4xl'>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        交易
                    </ModalHeader>
                    <ModalBody>
                        <Market/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MarketButton;