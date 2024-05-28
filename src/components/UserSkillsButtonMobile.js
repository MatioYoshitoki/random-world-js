import {
    Modal,
    ModalBody, ModalContent,
    ModalHeader, ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import React from "react";
import UserSkillsMobile from "./UserSkillsMobile";

function UserSkillsButtonMobile({buttonFunc, asset, setAsset, fishList}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            {buttonFunc(onOpen)}
            <Modal isCentered isOpen={isOpen} onClose={onClose} size='4xl'>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        技能
                    </ModalHeader>
                    <ModalBody>
                        <UserSkillsMobile userLevel={asset.level} fishList={fishList} expendGold={(cost) => {
                            const newAsset = {
                                ...asset
                            };
                            newAsset.gold = asset.gold - cost
                            setAsset(newAsset);
                        }}/>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserSkillsButtonMobile;