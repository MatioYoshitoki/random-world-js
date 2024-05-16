import './Login.css'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    useDisclosure,
    IconButton,
    Image,
    PopoverFooter, Button,
} from '@chakra-ui/react'
import {GetGodheadIcon} from "./style/GodheadIconUtil";
import {getFishLevelNameByLevel} from "./style/TextDisplayUtils";


function GodheadDetail({godhead}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
            <PopoverTrigger>
                <IconButton variant='ghost' isRound size='xs' aria-label={godhead.id}>
                    <Image maxW='15px' src={GetGodheadIcon(godhead.level)}/>
                </IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader fontWeight='semibold'>{godhead.fish_name}的{getFishLevelNameByLevel(godhead.level)}神格</PopoverHeader>
                <PopoverArrow/>
                <PopoverCloseButton/>
                <PopoverBody>
                    一枚{getFishLevelNameByLevel(godhead.level)}神格，击败强敌{godhead.fish_name}后得到的战利品，想必{godhead.master_name}此刻一定悲痛欲绝。
                </PopoverBody>
                {/*<PopoverFooter>*/}
                {/*    <Button colorScheme='teal' onClick={() => {*/}
                {/*        onClose();*/}
                {/*    }}>剥离</Button>*/}
                {/*</PopoverFooter>*/}
            </PopoverContent>
        </Popover>
    );
}

export default GodheadDetail;