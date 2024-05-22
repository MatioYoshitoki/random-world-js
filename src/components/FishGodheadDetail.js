import '../Login.css'
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
    PopoverFooter, Button, useToast,
} from '@chakra-ui/react'
import {GetGodheadIcon} from "../style/GodheadIconUtil";
import {getFishLevelNameByLevel} from "../style/TextDisplayUtils";
import Stage0 from "../assets/godhead_level_icon/stage_0.svg";
import {DivestitureFishGodhead} from "../request/Fish";
import {FailedToast, SuccessToast} from "../style/ShowToast";


function FishGodheadDetail({fishId, masterUid, godhead, loseGodhead}) {
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
    const uid = localStorage.getItem('uid');
    const mine = uid === masterUid.toString();
    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
            <PopoverTrigger>
                <IconButton variant='ghost' isRound size='xs' aria-label={godhead.id}>
                    <Image maxW='15px' src={icon}/>
                </IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader fontWeight='semibold'>{godhead.fish_name}的{getFishLevelNameByLevel(godhead.level)}神格</PopoverHeader>
                <PopoverArrow/>
                <PopoverCloseButton/>
                <PopoverBody>{desc}</PopoverBody>
                <PopoverFooter>
                    {hasMaster && mine && <Button colorScheme='teal' onClick={() => {
                        DivestitureFishGodhead(fishId, godhead.id, (message) => {
                            FailedToast(message, toast);
                        }, (message) => {
                            loseGodhead(godhead.id);
                            SuccessToast(message, toast);
                        }).then();
                        onClose();
                    }}>剥离</Button>}
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
}

export default FishGodheadDetail;