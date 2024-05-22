import {HStack, VStack} from "@chakra-ui/react";
import FishGodheadDetail from "./FishGodheadDetail";
import {useEffect, useState} from "react";

function FishGodhead({fishId, masterUid, godheadInfo}) {
    const [godheadList, setGodheadList] = useState(godheadInfo)
    const [firstLine, setFirstLine] = useState([])
    const [secondLine, setSecondLine] = useState([])
    useEffect(() => {
        if (godheadList && godheadList.length > 3) {
            const newFirstLine = []
            for (let i = 0; i < 3; i++) {
                newFirstLine[i] = godheadList[i]
            }
            setFirstLine(newFirstLine);
            const newSecondLine = []
            for (let i = 3; i < godheadList.length; i++) {
                newSecondLine[i-3] = godheadList[i]
            }
            setSecondLine(newSecondLine);
        } else {
            setFirstLine(godheadList);
        }
    }, [godheadList]);
    const loseGodhead = (godheadId) => {
        const newGodheadList = godheadList.filter(item => item.id !== godheadId);
        setGodheadList(newGodheadList);
    }
    return (
        <VStack>
            <HStack>
                {Array.isArray(firstLine) && firstLine.map(info => (
                    <FishGodheadDetail key={info.id} godhead={info} fishId={fishId} masterUid={masterUid} loseGodhead={loseGodhead}/>
                ))}
            </HStack>
            <HStack>
                {Array.isArray(secondLine) && secondLine.map(info => (
                    <FishGodheadDetail key={info.id} godhead={info} fishId={fishId} masterUid={masterUid} loseGodhead={loseGodhead}/>
                ))}
            </HStack>
        </VStack>
    )
}

export default FishGodhead;