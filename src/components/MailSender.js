import {Box, Button, useToast} from "@chakra-ui/react";
import {MailSend} from "../request/Mail";
import {FailedToast, SuccessToast} from "../style/ShowToast";

function MailSender({maxW, size, fontSize, fontWeight, colorScheme,showText, mail, doAfterSend}) {
    const toast = useToast();
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }
    const sendMail = (m) => {
        console.log(m);
        MailSend(m.receiverUid, m.mailType, m.propId, m.extra, (data)=> {
            doAfterSend();
            SuccessToast('发送成功!邮费:'+data.cost, toast);
        }, defaultFailedCallback).then();
    }
    return (<Box>
        <Button maxW={maxW} size={size} fontSize={fontSize} fontWeight={fontWeight} colorScheme={colorScheme} onClick={() => sendMail(mail)}>{showText}</Button>
    </Box>)
}

export default MailSender;