import {Box, Center, HStack, SimpleGrid} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import UserGodheadDetail from "./UserGodheadDetail";

function UserGodhead({godheadInfo, onlyShow}) {
    const [godheadList, setGodheadList] = useState([])
    useEffect(() => {
        setGodheadList(godheadInfo);
    }, [godheadInfo]);
    const loseGodhead = (godheadId) => {
        const newGodheadList = godheadList.filter(item => item.id !== godheadId);
        setGodheadList(newGodheadList);
    }
    return (
        <SimpleGrid columns={10} gap={-2}>
            {Array.isArray(godheadList) && godheadList.map(info => (
                <UserGodheadDetail onlyShow={onlyShow} key={info.id} godhead={info} loseGodhead={loseGodhead}/>
            ))}
        </SimpleGrid>
    )
}

export default UserGodhead;