import './Login.css'
import {
    VStack,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody, useDisclosure,
} from '@chakra-ui/react'


function SkillTargetSelector({fishList, targetStatus, callback, isDisabled}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
            <PopoverTrigger>
                <Button maxW='60px' size='xs' colorScheme='whatsapp'
                        isDisabled={isDisabled}>使用</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader fontWeight='semibold'>选择目标</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                   <VStack spacing={2}>
                       {Array.isArray(fishList) && fishList.filter(fish => fish.status === targetStatus).map(fish => (
                           <Button colorScheme='teal' onClick={() => {
                               callback(fish.id);
                               onClose();
                           }}>{fish.name}</Button>
                       ))}
                   </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

export default SkillTargetSelector;