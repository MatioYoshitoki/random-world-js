import {
    USER_ASSET_API_ENDPOINT, USER_BASE_INFO_API_ENDPOINT,
    USER_EAT_API_ENDPOINT,
    USER_EXPAND_PARKING_API_ENDPOINT,
    USER_PROPS_API_ENDPOINT, USER_RANK_API_ENDPOINT, USER_SKILL_UPGRADE_API_ENDPOINT, USER_SKILLS_API_ENDPOINT
} from "../config";
import {NotificationManager} from "react-notifications";
import api from "../BaseApi";

export const ExpandFishParking = (callback) => {
    return api.post(USER_EXPAND_PARKING_API_ENDPOINT, {})
        .then((response) => {
            const {code, data} = response.data;
            if (code === 0) {
                callback(data);
                NotificationManager.success('', '拓展成功!');

            } else {
                console.error('拓展失败：', response.data.message);
            }
        })
        .catch((error) => {
            console.error('拓展失败：', error);
        })
};


export const FetchUserBaseInfo = (callback) => {
    return api.post(USER_BASE_INFO_API_ENDPOINT, {}).then((response) => {
        const {code, data} = response.data;
        if (code === 0) {
            callback(data);
        } else {
            console.error('获取用户基础信息失败：', response.data.message);
        }
    })
        .catch(error => {
            console.error('获取用户基础信息失败：', error);

        })
};

export const FetchUserAsset = (callback) => {
    return api.post(USER_ASSET_API_ENDPOINT, {}).then((response) => {
        const {code, data} = response.data;
        if (code === 0) {
            callback(data);
        } else {
            console.error('获取用户资产失败：', response.data.message);
        }
    })
        .catch(error => {
            console.error('获取用户资产失败：', error);

        })
};

export const FetchProps = (page, callback) => {
    return api.post(USER_PROPS_API_ENDPOINT, {
        page: page,
        page_size: 20
    })
    .then(response => {
        const {list, total_page} = response.data.data;
        if (list !== undefined) {
            callback(list, total_page);
        }
    })
    .catch((error) => {
        console.error('Error fetching props:', error);
    })
};

export const EatProp =  (prop_id, callback) => {
    return api.post(USER_EAT_API_ENDPOINT, {
        prop_id: prop_id
    })
    .then(response => {
        if (response.data.code === 0) {
            // 使用成功
            // window.location.reload()
            callback(response.data.data);
        } else {
            // 购买失败
            NotificationManager.error('', response.data.message, 3000, () => {
                alert('callback');
            });
        }
    })
    .catch((error) => {
        console.error('使用请求失败:', error);
        NotificationManager.error('', '使用失败', 3000, () => {
            alert('callback');
        });
    })
};


export const FetchUserLevelRanks = (page, callback) => {
    return api.post(USER_RANK_API_ENDPOINT, {
        page: page,
        page_size: 10
    })
        .then(response => {
            const {user_level_rank} = response.data.data;
            if (user_level_rank !== undefined) {
                callback(user_level_rank, user_level_rank.total_page);
            }
        })
        .catch(error => {
            console.error('Error fetching user ranks:', error);
        })
};


export const FetchUserSkills = (callback) => {
    console.log('try fetch skills')
    return api.post(USER_SKILLS_API_ENDPOINT, {})
        .then(response => {
            const {skills} = response.data.data;
            console.log()
            if (skills !== undefined) {
                callback(skills);
            }
        })
        .catch(error => {
            console.error('Error fetching user skills:', error);
        })
};


export const UserSkillUpgrade = (skillId, callback) => {
    return api.post(USER_SKILL_UPGRADE_API_ENDPOINT, {
        skill_id: skillId
    })
        .then(response => {
            const {code} = response.data;
            console.log()
            if (code === 0) {
                NotificationManager.success('', '升级成功！');
                callback();
            }
        })
        .catch(error => {
            console.error('Error fetching user skills:', error);
        })
};