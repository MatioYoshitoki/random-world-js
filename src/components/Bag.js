import {SimpleGrid} from "@chakra-ui/react";
import BagItem from "./BagItem";

function Bag({columns, propList, buttonText}) {
    return (<SimpleGrid columns={columns} spacingX={5} spacingY={10}>
        {Array.isArray(propList) && propList.map(prop => (<BagItem key={prop.propId} prop={prop} buttonText={buttonText}/>))}
    </SimpleGrid>)
}

export default Bag;