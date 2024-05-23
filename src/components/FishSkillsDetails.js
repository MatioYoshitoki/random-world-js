import {
    Link,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {GetFishSkillColor} from "../style/ColorUtil";
import React from "react";
import {getFishSkillDescByLevel, getFishSkillNameByLevel} from "../style/TextDisplayUtils";

function FishSkillDetail({fishSkill, fontSize}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
            <PopoverTrigger>
                <Link fontSize={fontSize} color={GetFishSkillColor(fishSkill.level)} onClick={onOpen}>{getFishSkillNameByLevel(fishSkill.skill_id, fishSkill.level)}</Link>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <Text color={GetFishSkillColor(fishSkill.level)} fontWeight='bold'>
                        {getFishSkillNameByLevel(fishSkill.skill_id, fishSkill.level)}
                    </Text>
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <Text>
                        {getFishSkillDescByLevel(fishSkill.skill_id, fishSkill.level)}
                    </Text>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default FishSkillDetail;