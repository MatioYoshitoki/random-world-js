import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    useDisclosure, useToast
} from "@chakra-ui/react";
import React from "react";
import {SellStop} from "../request/Market";
import {FailedToast, SuccessToast} from "../style/ShowToast";
import {FetchFishList, FetchFishParkingList} from "../request/Fish";


function DownSellCheckButton({fish, setFishParkingList, refreshFishList}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const cancelRef = React.useRef();
    const toast = useToast();
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    return (
        <>
            <Button bg='blue.200' onClick={onOpen}>下架</Button>
            <AlertDialog
                isCentered
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            下架【{fish.name}】确认
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            下架【{fish.name}】? 手续费将不退还。
                        </AlertDialogBody>
                        <AlertDialogFooter gap={4}>
                            <Button colorScheme='blue' onClick={() => SellStop(fish.id, () => {
                                SuccessToast('下架成功', toast);
                                onClose();
                                FetchFishParkingList(setFishParkingList, defaultFailedCallback).then();
                                FetchFishList(refreshFishList, defaultFailedCallback).then();
                            }, defaultFailedCallback)}>下架</Button>
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

export default DownSellCheckButton;