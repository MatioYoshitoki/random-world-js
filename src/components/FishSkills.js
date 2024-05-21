import {Box, ListItem, Text, Tooltip, UnorderedList} from "@chakra-ui/react";
import {GetFishSkillColor} from "../style/ColorUtil";
import React from "react";
import {getFishSkillDescByLevel, getFishSkillNameByLevel} from "../style/TextDisplayUtils";

function FishSkills({fishSkillList, awakingRemain}) {
    return (
        <Box>
            <Text>技能{awakingRemain != null && awakingRemain !== 0 && (<>【未觉醒{awakingRemain}条】</>)}：</Text>
            <UnorderedList>
                {Array.isArray(fishSkillList) && fishSkillList.map(fishSkill => (
                    <ListItem key={fishSkill.skill_id}>
                        {fishSkill && (
                            <Tooltip label={getFishSkillDescByLevel(fishSkill.skill_id, fishSkill.level)}
                                     placement='left'>
                                <Text fontWeight='bold'
                                      textColor={GetFishSkillColor(fishSkill.level)}>{getFishSkillNameByLevel(fishSkill.skill_id, fishSkill.level)}</Text>
                            </Tooltip>
                        )}
                    </ListItem>
                ))}
            </UnorderedList>
            {!Array.isArray(fishSkillList) &&
                <Text>暂未觉醒技能</Text>}
        </Box>
    )
}

export default FishSkills;