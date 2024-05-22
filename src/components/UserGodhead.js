import {HStack} from "@chakra-ui/react";
import {useState} from "react";
import UserGodheadDetail from "./UserGodheadDetail";

function UserGodhead({godheadInfo}) {
    const [godheadList, setGodheadList] = useState(godheadInfo)
    const loseGodhead = (godheadId) => {
        const newGodheadList = godheadList.filter(item => item.id !== godheadId);
        setGodheadList(newGodheadList);
    }
    return (
        <HStack>
            {Array.isArray(godheadList) && godheadList.map(info => (
                <UserGodheadDetail key={info.id} godhead={info} loseGodhead={loseGodhead}/>
            ))}
        </HStack>
    )
}

export default UserGodhead;