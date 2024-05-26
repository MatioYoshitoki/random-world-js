import {Badge, List, ListItem, Text, VStack} from "@chakra-ui/react";
import moment from 'moment';
import {useEffect, useState} from "react";

function FishDeadRecords({records}) {
    const [recordWithTag, setRecordWithTag] = useState([]);

    useEffect(() => {
        let latestTag = ''
        const newRecordWithTag = []
        if (Array.isArray(records)) {
            let tmp = [];
            let idx = 0
            for (let record of records) {
                const currentTag = moment(record.record_at_ms).format('YYYY-MM-DD hh:mm:ss');
                if (currentTag === latestTag || latestTag === '') {
                    tmp.push({
                        content: record.content,
                        record_at_ms: record.record_at_ms,
                        key: idx
                    });
                } else if (latestTag !== ''){
                    newRecordWithTag.push({
                        time_tag: latestTag,
                        content_list: tmp,
                    })
                    tmp = [{
                        content: record.content,
                        record_at_ms: record.record_at_ms,
                        key: idx
                    }]
                }
                latestTag = currentTag;
                idx ++;
                if (idx === records.length) {
                    newRecordWithTag.push({
                        time_tag: latestTag,
                        content_list: tmp,
                    })
                }
            }
        }
        setRecordWithTag(newRecordWithTag);
    }, [records]);

    return (<List spacing={3}>
        {Array.isArray(recordWithTag) && recordWithTag.map(record => (
            <ListItem key={record.time_tag}>
                <VStack textAlign='left'>
                    <Badge>{record.time_tag}</Badge>
                    {Array.isArray(record.content_list) && record.content_list.map(content => (
                        <Text key={content.key}>{content.content}</Text>
                    ))}
                </VStack>
            </ListItem>
        ))}
    </List>)
}

export default FishDeadRecords;