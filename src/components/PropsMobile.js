import React from 'react';
import '../Login.css'
import {
    Box,
    IconButton, Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader, ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, useDisclosure
} from '@chakra-ui/react';
import ExpPropList from "./ExpProps";
import GodheadPropList from "./GodheadProps";
import propsIcon from "../assets/mobile_button_icon/props.svg";

function PropListMobileButton({columns, size, pageSize, incrExp}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <Box>
            <IconButton aria-label='背包' onClick={onOpen} icon={<Image src={propsIcon}/>}/>
            <Modal isCentered isOpen={isOpen} onClose={onClose} size={size}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        背包
                    </ModalHeader>
                    <ModalBody>
                        <Tabs variant='enclosed'>
                            <TabList>
                                <Tab>灵气丹</Tab>
                                <Tab>神格</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <ExpPropList pageSize={pageSize} columns={columns} incrExp={incrExp}/>
                                </TabPanel>
                                <TabPanel >
                                    <GodheadPropList pageSize={pageSize}  columns={columns} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default PropListMobileButton;