import {
    USER_ASSET_API_ENDPOINT,
    USER_BASE_INFO_API_ENDPOINT,
    USER_CRAZY_FISH_API_ENDPOINT,
    USER_EAT_API_ENDPOINT,
    USER_EXPAND_PARKING_API_ENDPOINT, USER_FEED_FISH_API_ENDPOINT, USER_HEAL_FISH_API_ENDPOINT,
    USER_PROPS_API_ENDPOINT,
    USER_RANK_API_ENDPOINT,
    USER_SHADOW_FISH_API_ENDPOINT,
    USER_SKILL_UPGRADE_API_ENDPOINT,
    USER_SKILLS_API_ENDPOINT
} from "../config";
import api from "../BaseApi";

export const ExpandFishParking = (callback, failedCallback) => {
    return api.post(USER_EXPAND_PARKING_API_ENDPOINT, {})
        .then((response) => {
            const {code, data} = response.data;
            if (code === 0) {
                callback(data);
            } else {
                failedCallback(response.data.message);
            }
        })
        .catch((error) => {
            console.error('拓展失败：', error);
        })
};


export const FetchUserBaseInfo = (callback, failedCallback) => {
    return api.post(USER_BASE_INFO_API_ENDPOINT, {}).then((response) => {
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

export const FetchUserAsset = (callback, failedCallback) => {
    return api.post(USER_ASSET_API_ENDPOINT, {}).then((response) => {
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

export const FetchProps = (page, callback, failedCallback) => {
    return api.post(USER_PROPS_API_ENDPOINT, {
        page: page,
        page_size: 20
    })
        .then(response => {
            if (response.data.code === 0) {
                const {list, total_page} = response.data.data;
                if (list !== undefined) {
                    callback(list, total_page);
                }
            } else {
                failedCallback(response.data.message);
            }
        })
        .catch((error) => {
            console.error('Error fetching props:', error);
        })
};

export const EatProp = (prop_id, callback, failedCallback) => {
    return api.post(USER_EAT_API_ENDPOINT, {
        prop_id: prop_id
    })
        .then(response => {
            if (response.data.code === 0) {
                // 使用成功
                callback(response.data.data);
            } else {
                failedCallback(response.data.message);
            }
        })
        .catch((error) => {
            console.error('使用请求失败:', error);
        })
};


export const FetchUserLevelRanks = (page, callback, failedCallback) => {
    return api.post(USER_RANK_API_ENDPOINT, {
        page: page,
        page_size: 10
    })
        .then(response => {
            if (response.data.code === 0) {
                const {user_level_rank} = response.data.data;
                if (user_level_rank !== undefined) {
                    callback(user_level_rank, user_level_rank.total_page);
                }
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


export const FetchUserSkills = (callback, failedCallback) => {
    console.log('try fetch skills')
    return api.post(USER_SKILLS_API_ENDPOINT, {})
        .then(response => {
            if (response.data.code === 0) {
                const {skills} = response.data.data;
                if (skills !== undefined) {
                    callback(skills);
                }
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


export const UserSkillUpgrade = (skillId, callback, failedCallback) => {
    return api.post(USER_SKILL_UPGRADE_API_ENDPOINT, {
        skill_id: skillId
    })
        .then(response => {
            const {code} = response.data;
            if (code === 0) {
                callback();
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


export const UserCrazyFish = (fishId, callback, failedCallback) => {
    console.log('try crazy fish: ' + fishId);
    return api.post(USER_CRAZY_FISH_API_ENDPOINT, {
        fish_id: fishId,
    })
        .then(response => {
            if (response.data.code === 0) {
                const {crazy_skill_cold_down_at_ms, crazy_duration_at_ms} = response.data.data;
                callback(crazy_skill_cold_down_at_ms, crazy_duration_at_ms);
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


export const UserShadowFish = (fishId, callback, failedCallback) => {
    console.log('try shadow fish: ' + fishId);
    return api.post(USER_SHADOW_FISH_API_ENDPOINT, {
        fish_id: fishId,
    })
        .then(response => {
            if (response.data.code === 0) {
                const {shadow_skill_cold_down_at_ms, shadow_duration_at_ms} = response.data.data;
                callback(shadow_skill_cold_down_at_ms, shadow_duration_at_ms);
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


export const UserFeedFish = (fishId, callback, failedCallback) => {
    console.log('try feed fish: ' + fishId);
    return api.post(USER_FEED_FISH_API_ENDPOINT, {
        fish_id: fishId,
    })
        .then(response => {
            console.log(response.data);
            if (response.data.code === 0) {
                const {feed_skill_cold_down_at_ms} = response.data.data;
                callback(feed_skill_cold_down_at_ms);
            } else {
                console.log(response.data.message);
                failedCallback(response.data.message);
            }
        })
        .catch(error => {
            console.log(error);
            if (error.response) {
                failedCallback(error.response.message);
            }
        })
};


export const UserHealFish = (fishId, callback, failedCallback) => {
    console.log('try heal fish: ' + fishId);
    return api.post(USER_HEAL_FISH_API_ENDPOINT, {
        fish_id: fishId,
    })
        .then(response => {
            if (response.data.code === 0) {
                const {heal_skill_cold_down_at_ms} = response.data.data;
                callback(heal_skill_cold_down_at_ms);
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
