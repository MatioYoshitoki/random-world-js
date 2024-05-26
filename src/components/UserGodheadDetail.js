import '../Login.css'
import {
    Box,
    Button,
    IconButton,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import {GetGodheadIcon} from "../style/GodheadIconUtil";
import {getFishLevelNameByLevel} from "../style/TextDisplayUtils";
import Stage0 from "../assets/godhead_level_icon/stage_0.svg";
import {FailedToast, SuccessToast} from "../style/ShowToast";
import {DestroyGodhead} from "../request/User";


function UserGodheadDetail({godhead, loseGodhead, onlyShow}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const toast = useToast();
    let desc = '一枚'+getFishLevelNameByLevel(godhead.level)+'神格，击败强敌'+godhead.fish_name+'后得到的战利品，';
    let icon = Stage0;
    const hasMaster = godhead.master_name && godhead.master_name !== ''
    if (hasMaster) {
        desc += '想必'+godhead.master_name+'此刻一定悲痛欲绝。';
        icon = GetGodheadIcon(godhead.level);
    } else {
        desc += '无主的鱼，神格的光芒似乎也更加黯淡。';
    }
    return (
        <Box>
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
                <PopoverTrigger>
                    <IconButton variant='ghost' isRound size='xs' aria-label={godhead.id}>
                        <Image maxW='14px' src={icon}/>
                    </IconButton>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader color='black' fontWeight='semibold'>{godhead.fish_name}的{getFishLevelNameByLevel(godhead.level)}神格</PopoverHeader>
                    <PopoverArrow/>
                    <PopoverCloseButton/>
                    <PopoverBody color='black' maxH='100%'>
                        {desc}
                    </PopoverBody>
                    {!onlyShow && (
                        <PopoverFooter>=
                            <Button colorScheme='teal' onClick={() => {
                                DestroyGodhead(godhead.id, (message) => {
                                    FailedToast(message, toast);
                                }, (message) => {
                                    loseGodhead(godhead.id);
                                    SuccessToast(message, toast);
                                }).then();
                                onClose();
                            }}>捏碎</Button>
                        </PopoverFooter>
                    )}
                </PopoverContent>
            </Popover>
        </Box>
    );
}

export default UserGodheadDetail;