import MoonListIcon from "../assets/special_time/moon_light.svg";
import {Image} from "@chakra-ui/react";
import React from "react";

function MoonLight() {
    return (
        <Image className='moon-light' maxH='40px' src={MoonListIcon}/>
    )
}

export default MoonLight;