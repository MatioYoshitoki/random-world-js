import {
    Badge,
    Box,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {getFishLevelNameByLevel} from "../style/TextDisplayUtils";
import {useEffect, useState} from "react";


function FishLevelInfo({level, fontSize}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [lowLevel, setLowLevel] = useState([]);
    const [highLevel, setHighLevel] = useState([]);
    useEffect(() => {
        const newLl = []
        const newHl = []

        if (level > 1) {
            for (let i = Math.max(1, level-5); i <level; i++) {
                newLl.push(i);
            }
        }
        for (let i = level + 1; i < level+6; i++) {
            newHl.push(i)
        }
        setLowLevel(newLl);
        setHighLevel(newHl);
    }, [level]);
    return (
        <>
            <Box fontSize={fontSize}>
                境界：
                <Link onClick={onOpen} color='teal.500'>{getFishLevelNameByLevel(level)}</Link>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>境界说明</ModalHeader>
                    <ModalBody>
                        <VStack>
                            {lowLevel && lowLevel.map(low => (
                                <Badge fontSize={10}>{getFishLevelNameByLevel(low)}</Badge>
                            ))}
                            <Badge fontSize={18} colorScheme='green'>{getFishLevelNameByLevel(level)}</Badge>
                            {highLevel && highLevel.map(high => (
                                <Badge fontSize={15} variant='solid' colorScheme='green'>
                                    {getFishLevelNameByLevel(high)}
                                </Badge>
                            ))}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default FishLevelInfo;