import React from 'react';
import '../Login.css'
import {
    Box,
    Button,
    Modal, ModalBody,
    ModalContent, ModalHeader, ModalOverlay,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure
} from '@chakra-ui/react';
import ExpPropList from "./ExpProps";
import GodheadPropList from "./GodheadProps";

function PropList({columns, pageSize, size, incrExp}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <Box>
            <Button onClick={onOpen}>背包</Button>
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

export default PropList;