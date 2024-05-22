import {SimpleGrid} from "@chakra-ui/react";
import BagItem from "./BagItem";

function Bag({propList, buttonText}) {
    return (<SimpleGrid columns={10} spacingX={5} spacingY={10}>
        {Array.isArray(propList) && propList.map(prop => (<BagItem key={prop.propId} prop={prop} buttonText={buttonText}/>))}
    </SimpleGrid>)
}

export default Bag;