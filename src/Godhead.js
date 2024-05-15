import {HStack, Image} from "@chakra-ui/react";
import {GetGodheadIcon} from "./style/GodheadIconUtil";

function Godhead({godheadInfo}) {
    return (
        <HStack>
            {Array.isArray(godheadInfo) && godheadInfo.map( info => (
                <Image maxW='10px'
                    src={GetGodheadIcon(info.level)}
                />
            ))}

        </HStack>
    )
}

export default Godhead;