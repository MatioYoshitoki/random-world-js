import {HStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import UserGodheadDetail from "./UserGodheadDetail";

function UserGodhead({godheadInfo}) {
    const [godheadList, setGodheadList] = useState([])
    useEffect(() => {
        setGodheadList(godheadInfo);
    }, [godheadInfo]);
    const loseGodhead = (godheadId) => {
        const newGodheadList = godheadList.filter(item => item.id !== godheadId);
        setGodheadList(newGodheadList);
    }
    return (
        <HStack gap={0}>
            {Array.isArray(godheadList) && godheadList.map(info => (
                <UserGodheadDetail key={info.id} godhead={info} loseGodhead={loseGodhead}/>
            ))}
        </HStack>
    )
}

export default UserGodhead;