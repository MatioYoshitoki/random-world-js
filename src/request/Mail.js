import api from "../BaseApi";
import {
    MAIL_RECEIVE_API_ENDPOINT,
    MAIL_RECEIVED_API_ENDPOINT,
    MAIL_REMOVE_API_ENDPOINT,
    MAIL_SEND_API_ENDPOINT
} from "../config";

export const FetchMailReceived = (latest_mail_id, callback, failedCallback) => {
    return api.post(MAIL_RECEIVED_API_ENDPOINT, {
        latest_mail_id: latest_mail_id,
    }).then((response) => {
        const {code, data} = response.data;
        if (code === 0) {
            callback(data.list, data.latest_mail_id, latest_mail_id);
        } else {
            failedCallback(response.data.message);
        }
    })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        })
};


export const MailReceive = (mail_id, callback, failedCallback) => {
    return api.post(MAIL_RECEIVE_API_ENDPOINT, {
        mail_id: mail_id.toString()
    }).then((response) => {
        const {code, data} = response.data;
        if (code === 0) {
            callback(data);
        } else {
            failedCallback(response.data.message);
        }
    })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        })
};


export const MailRemove = (mail_id, callback, failedCallback) => {
    return api.post(MAIL_REMOVE_API_ENDPOINT, {
        mail_id: mail_id.toString()
    }).then((response) => {
        const {code, data} = response.data;
        if (code === 0) {
            callback(data);
        } else {
            failedCallback(response.data.message);
        }
    })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        })
};


export const MailSend = (receiverUid, mailType, propId, extra, callback, failedCallback) => {
    return api.post(MAIL_SEND_API_ENDPOINT, {
        receiver_uid: receiverUid,
        mail_type: mailType,
        prop_id: propId,
        extra: extra,
    }).then((response) => {
        const {code, data} = response.data;
        if (code === 0) {
            callback(data);
        } else {
            failedCallback(response.data.message);
        }
    })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        })
};