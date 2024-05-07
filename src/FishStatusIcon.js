import {Image, Stack} from "@chakra-ui/react";
import fishAliveIcon from './assets/fish_status/fish_alive.svg';
import fishSleepIcon from './assets/fish_status/fish_sleep.svg';
import fishUpSellIcon from './assets/fish_status/fish_up_sell.svg';
import fishDeadIcon from './assets/fish_status/fish_dead.svg';


function FishStatusIcon({status}) {
    return (
        <Stack>
            <Image
                borderRadius='full'
                boxSize='50px'
                src={fishStatusIconUrl(status)}
            />
        </Stack>
    )
}

function fishStatusIconUrl(status) {
    if (status === 0) {
        return fishAliveIcon;
    } else if (status === 1) {
        return fishSleepIcon;
    } else if (status === 2) {
        return fishUpSellIcon;
    } else if (status === 3) {
        return fishDeadIcon;
    }
}

export default FishStatusIcon;