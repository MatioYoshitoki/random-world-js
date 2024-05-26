import React, {useEffect, useState} from "react";
import {
    Button, ButtonGroup, Center, HStack,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import FishDeadRecordIcon from "../assets/fish/dead_records.svg";
import {FetchFishDeadRecords} from "../request/Fish";
import FishDeadRecords from "./FishDeadRecords";
import FishKillerDetails from "./FishKillerDetails";

function FishDeadRecordsTrigger({fish}) {
    const [records, setRecords] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [latestKiller, setLatestKiller] = useState(null);
    const openRecord = (fishId) => {
        FetchFishDeadRecords(fishId, setRecords).then(() => {
            onOpen()
        });
    }
    useEffect(() => {
        if (records != null) {
            for (let record of records) {
                if (record.event_type === 4 && record.master_uid !== '0') {
                    setLatestKiller(record.master_uid);
                }
            }
        }
    }, [records]);

    const btnRef = React.useRef(null)
    return (
        <>
            <IconButton variant='ghost' isRound size='xs' aria-label='1' onClick={() => openRecord(fish.id)} ref={btnRef}>
                <Image maxW='30px' src={FishDeadRecordIcon}/>
            </IconButton>
            <Modal
                onClose={onClose}
                finalFocusRef={btnRef}
                isOpen={isOpen}
                scrollBehavior='inside'
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>死亡回放</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FishDeadRecords records={records}/>
                    </ModalBody>
                    <ModalFooter gap={4}>
                        {latestKiller && (
                            <FishKillerDetails fontSize={15} uid={latestKiller} canRecall={false} recallFishName={fish.level >= 27?fish.name:undefined}/>
                        )}
                        <Button onClick={onClose}>关闭</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>)
}

export default FishDeadRecordsTrigger;