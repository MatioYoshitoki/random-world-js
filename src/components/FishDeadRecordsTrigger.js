import React, {useState} from "react";
import {
    Button,
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

function FishDeadRecordsTrigger({fishId}) {
    const [records, setRecords] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const openRecord = (fishId) => {
        FetchFishDeadRecords(fishId, setRecords).then(() => onOpen());
    }
    const btnRef = React.useRef(null)
    return (
        <>
            <IconButton variant='ghost' isRound size='xs' aria-label='1' onClick={() => openRecord(fishId)} ref={btnRef}>
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
                        <Button onClick={onClose}>关闭</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>)
}

export default FishDeadRecordsTrigger;