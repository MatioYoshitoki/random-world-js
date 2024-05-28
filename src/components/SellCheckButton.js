import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    FormControl, FormHelperText,
    FormLabel, HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper, Radio, RadioGroup,
    useDisclosure, useToast
} from "@chakra-ui/react";
import React, {useState} from "react";
import {SellStart} from "../request/Market";
import {FailedToast, SuccessToast} from "../style/ShowToast";
import {FetchFishList, FetchFishParkingList} from "../request/Fish";


function SellCheckButton({fish, asset, setAsset, setFishParkingList, refreshFishList}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const cancelRef = React.useRef();
    const [price, setPrice] = useState(1000);
    const [duration, setDuration] = useState('half_day');
    const toast = useToast();
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    return (
        <>
            <Button bg='cyan.50' onClick={onOpen}>上架</Button>
            <AlertDialog
                isCentered
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            上架【{fish.name}】
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <FormControl>
                                <FormLabel>价格</FormLabel>
                                <NumberInput defaultValue={price} min={0} onChange={(e) => setPrice(e)}>
                                    <NumberInputField/>
                                    <NumberInputStepper>
                                        <NumberIncrementStepper/>
                                        <NumberDecrementStepper/>
                                    </NumberInputStepper>
                                </NumberInput>
                                <FormHelperText>合理的价格可以让您的商品更受青睐</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>上架时长</FormLabel>
                                <RadioGroup defaultValue={duration} onChange={(e) => setDuration(e)}>
                                    <HStack spacing='24px'>
                                        <Radio value='half_day'>半天</Radio>
                                        <Radio value='one_day'>一天</Radio>
                                        <Radio value='three_day'>三天</Radio>
                                        <Radio value='one_week'>一周</Radio>
                                    </HStack>
                                </RadioGroup>
                                <FormHelperText>注. 手续费取决于售价与上架时长</FormHelperText>
                            </FormControl>
                        </AlertDialogBody>
                        <AlertDialogFooter gap={4}>
                            <Button colorScheme='yellow' onClick={() => SellStart(fish, price, duration, asset, (commission) => {
                                        SuccessToast('上架成功! 扣除手续费' + commission + '晶石', toast)
                                        setAsset({
                                            ...asset,
                                            gold: asset.gold - commission
                                        })
                                        onClose();
                                        FetchFishParkingList(setFishParkingList, defaultFailedCallback).then();
                                        FetchFishList(refreshFishList, defaultFailedCallback).then();
                                    }, defaultFailedCallback)}>上架</Button>
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

export default SellCheckButton;