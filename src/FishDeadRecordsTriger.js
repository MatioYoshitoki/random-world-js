import React from "react";
import {
    Button,
    IconButton,
    Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure
} from "@chakra-ui/react";
import FishDeadRecordIcon from "./assets/fish/dead_records.svg";
import {FetchFishDeadRecords} from "./request/Fish";
import {useState} from "react";
import FishDeadRecords from "./FishDeadRecords";

function FishDeadRecordsTriger({fishId}) {
    const [records, setRecords] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const openRecord = (fishId) => {
        FetchFishDeadRecords(fishId, setRecords).then(() => onOpen());
    }
    const btnRef = React.useRef(null)
    return (
        <>
            <IconButton variant='ghost' isRound size='xs' aria-label='1' onClick={openRecord} ref={btnRef}>
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
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>)
}

export default FishDeadRecordsTriger;