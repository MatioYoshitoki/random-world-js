import React from 'react';
import '../Login.css'
import {
    TabList, Tab, TabPanels, TabPanel, Tabs
} from '@chakra-ui/react';
import ExpPropList from "./ExpProps";
import GodheadPropList from "./GodheadProps";

function PropList({columns, incrExp}) {
    return (<Tabs variant='enclosed'>
            <TabList>
                <Tab>灵气丹</Tab>
                <Tab>神格</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <ExpPropList columns={columns} incrExp={incrExp}/>
                </TabPanel>
                <TabPanel>
                    <GodheadPropList columns={columns} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

export default PropList;