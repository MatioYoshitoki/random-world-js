import {Badge, List, ListItem, Text, VStack} from "@chakra-ui/react";
import moment from 'moment';

function FishDeadRecords({records}) {
    const recordWithTag = []
    let latestTag = ''
    if (Array.isArray(records)) {
        let tmp = [];
        let idx = 0
        for (let record of records) {
            const currentTag = moment(record.record_at_ms).format('YYYY-MM-DD hh:mm:ss');
            if (currentTag === latestTag || latestTag === '') {
                tmp.push(record.content);
            } else if (latestTag !== ''){
                recordWithTag.push({
                    time_tag: latestTag,
                    content_list: tmp,
                })
                tmp = [record.content]
            }
            latestTag = currentTag;
            idx ++;
            if (idx === records.length) {
                recordWithTag.push({
                    time_tag: latestTag,
                    content_list: tmp,
                })
            }
        }
    }
    return (<List spacing={3}>
        {Array.isArray(recordWithTag) && recordWithTag.map(record => (
            <ListItem>
                <VStack textAlign='left'>
                    <Badge>{record.time_tag}</Badge>
                    {Array.isArray(record.content_list) && record.content_list.map(content => (
                        <Text>{content}</Text>
                    ))}
                </VStack>
            </ListItem>
        ))}
    </List>)
}

export default FishDeadRecords;