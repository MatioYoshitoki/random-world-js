import {
    Modal,
    ModalBody, ModalContent,
    ModalHeader, ModalOverlay,
    Tab,
    TabList, TabPanel,
    TabPanels,
    Tabs,
    useDisclosure
} from "@chakra-ui/react";
import React from "react";
import UserLevelRank from "./UserLevelRank";
import PoolRank from "./PoolRank";
import UserLevelRankMobile from "./UserLevelRankMobile";
import PoolRankMobile from "./PoolRankMobile";

function PoolRankButton({buttonFunc, isMobile}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            {buttonFunc(onOpen)}
            <Modal isCentered isOpen={isOpen} onClose={onClose} size='4xl'>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        榜单
                    </ModalHeader>
                    <ModalBody>
                        <Tabs variant='enclosed'>
                            <TabList>
                                <Tab>玩家等级榜</Tab>
                                <Tab>🐟修为榜</Tab>
                                <Tab>🐟击杀榜</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    {isMobile && (<UserLevelRankMobile/>)}
                                    {!isMobile && (<UserLevelRank/>)}
                                </TabPanel>
                                <TabPanel>
                                    {isMobile && (<PoolRankMobile rankType={0}/>)}
                                    {!isMobile && (<PoolRank rankType={0}/>)}
                                </TabPanel>
                                <TabPanel>
                                    {isMobile && (<PoolRankMobile rankType={1}/>)}
                                    {!isMobile && (<PoolRank rankType={1}/>)}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PoolRankButton;