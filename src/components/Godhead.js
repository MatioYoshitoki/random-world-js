import {HStack, VStack} from "@chakra-ui/react";
import GodheadDetail from "./GodheadDetail";

function Godhead({godheadInfo}) {
    let firstLine = []
    const secondLine = []
    if (godheadInfo && godheadInfo.length > 3) {
        for (let i = 0; i < 3; i++) {
            firstLine[i] = godheadInfo[i]
        }
        for (let i = 3; i < godheadInfo.length; i++) {
            secondLine[i-3] = godheadInfo[i]
        }
    } else {
        firstLine = godheadInfo
    }

    return (
        <VStack>
            <HStack>
                {Array.isArray(firstLine) && firstLine.map(info => (
                    <GodheadDetail key={info.id} godhead={info}/>
                ))}
            </HStack>
            <HStack>
                {Array.isArray(secondLine) && secondLine.map(info => (
                    <GodheadDetail key={info.id} godhead={info}/>
                ))}
            </HStack>
        </VStack>
    )
}

export default Godhead;