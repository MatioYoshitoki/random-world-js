import {
    Modal,
    ModalBody, ModalContent,
    ModalHeader, ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import React from "react";
import Market from "./Market";
import MarketMobileList from "./MarketMobile";

function MarketButton({isMobile, buttonFunc}) {
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
                        {isMobile && <MarketMobileList/>}
                        {!isMobile && <Market/>}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MarketButton;