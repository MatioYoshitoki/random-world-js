import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    IconButton,
    Image,
    Text,
    useDisclosure, VStack,
} from "@chakra-ui/react";
import React from "react";

function BagItem({prop}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const cancelRef = React.useRef()
    return (
        <Box>
            <VStack borderWidth='4px' borderRadius='lg' overflow='hidden'>
                <IconButton alignItems='center' maxW='40px' aria-label={prop.propId} icon={<Image src={prop.propImage} onClick={onOpen}/>}/>
                <Text fontSize={9}>{prop.propName}</Text>
            </VStack>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>{prop.propName}</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        {prop.propRemark}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            关闭
                        </Button>
                        <Button colorScheme='red' ml={3} onClick={() => {
                            prop.useFunc(prop).then();
                            onClose();
                        }}>
                            使用
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
        )
}

export default BagItem;