import {Badge, HStack, List, ListItem, Text} from "@chakra-ui/react";
import moment from 'moment';

function FishDeadRecords({records}) {
    return (<List spacing={3}>
        {Array.isArray(records) && records.map(record => (
            <ListItem>
                <HStack textAlign='left'>
                    <Badge>{moment(record.record_at_ms).format('YYYY-MM-DD hh:mm:ss')}</Badge>
                    <Text>{record.content}</Text>
                </HStack>
            </ListItem>
        ))}
    </List>)
}

export default FishDeadRecords;