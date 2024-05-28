import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Button,
    useDisclosure
} from "@chakra-ui/react";
import React from "react";
import {RefineFish} from "../request/Fish";


function RefiningCheckButton({fish, fishList, fishParkingList, defaultFailedCallback, setFishParkingList, refreshFishList}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const cancelRef = React.useRef();
    const refine = (fishId) => {
        // 发送炼化请求
        RefineFish(fishId, defaultFailedCallback, () => {
            const newFishList = fishList.filter(fish => fish.fish.id !== fishId);
            const newParkingList = [...fishParkingList];
            for (let fish of fishList) {
                if (fish.fish.id === fishId) {
                    for (let parking of newParkingList) {
                        if (parking.parking === fish.parking) {
                            parking.status = 1;
                        }
                    }
                }
            }
            setFishParkingList(newParkingList);
            refreshFishList(newFishList);
            onClose();
        }).then();
    };
    return (
        <>
            <Button bg='orange.100' onClick={onOpen}>炼化</Button>
            <AlertDialog
                isCentered
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            确认炼化{fish.name}吗?
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            炼化后可获得灵气丹。
                        </AlertDialogBody>
                        <AlertDialogFooter gap={4}>
                            <Button bg='orange.100' onClick={() => refine(fish.id)} ml={3}>
                                确认
                            </Button>
                            <Button ref={cancelRef} onClick={onClose}>
                                取消
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default RefiningCheckButton;