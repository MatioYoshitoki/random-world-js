import {Box, ListItem, Text, UnorderedList, useDisclosure} from "@chakra-ui/react";
import React from "react";
import FishSkillDetail from "./FishSkillsDetails";

function FishSkills({fishSkillList, awakingRemain, fontSize}) {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const skillDescOpen = (fishSkill) => {
        console.log(fishSkill);
        onOpen();
        console.log(isOpen);
    }
    return (
        <Box>
            <Text fontSize={fontSize}>技能{awakingRemain != null && awakingRemain !== 0 && (<>【未觉醒{awakingRemain}条】</>)}：</Text>
            <UnorderedList>
                {Array.isArray(fishSkillList) && fishSkillList.map(fishSkill => (
                    <ListItem key={fishSkill.skill_id}>
                        {fishSkill && (
                            <FishSkillDetail fishSkill={fishSkill} fontSize={fontSize}/>
                        )}
                    </ListItem>
                ))}
            </UnorderedList>
            {!Array.isArray(fishSkillList) &&
                <Text fontSize={fontSize}>暂未觉醒技能</Text>}
        </Box>
    )
}

export default FishSkills;