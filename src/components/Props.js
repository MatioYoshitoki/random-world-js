import React from 'react';
import '../Login.css'
import {
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

function PropListButton({buttonFunc, columns, pageSize, size, incrExp}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
            {buttonFunc(onOpen)}
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
        </>
    );
}

export default PropListButton;