import {
    FISH_ALIVE_API_ENDPOINT,
    FISH_CREATE_API_ENDPOINT,
    FISH_LIST_API_ENDPOINT, FISH_PARKING_LIST_API_ENDPOINT,
    FISH_PULL_API_ENDPOINT, FISH_REFINE_API_ENDPOINT,
    FISH_SLEEP_API_ENDPOINT
} from "../config";
import api from "../BaseApi";
import {NotificationManager} from "react-notifications";

export const PullFish = (afterPull) => {
    return api.post(FISH_PULL_API_ENDPOINT, {})
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                afterPull(data.list)
                localStorage.setItem("ts_ms", data.ts_ms)
            } else {
                console.error('获取用户鱼信息失败：', response.data.message);
            }
        })
        .catch(error => {
            console.error('获取用户鱼信息失败：', error);
        });
};

export const FetchFishList = (callback) => {
    return api.post(FISH_LIST_API_ENDPOINT, {})
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                callback(data.list);
            } else {
                console.error('获取用户鱼信息失败：', response.data.message);
            }
        })
        .catch(error => {
            console.error('获取用户鱼信息失败：', error);
        })
};

export const SleepFish = (fishId, callback) => {
    return api.post(FISH_SLEEP_API_ENDPOINT, {fish_id: fishId})
        .then(response => {
            if (response.data.code === 0) {
                callback()
            } else {
                NotificationManager.error('', response.data.message, 3000, () => {
                    alert('callback');
                });
            }
            // 重新加载鱼列表数据
        })
        .catch(error => {
            console.error('Error resting fish:', error);
        });
}

export const AliveFish = (fishId, callback) => {
    return api.post(FISH_ALIVE_API_ENDPOINT, {fish_id: fishId})
        .then(response => {
            if (response.data.code === 0) {
                callback()
            } else {
                NotificationManager.error('', response.data.message, 3000, () => {
                    alert('callback');
                })
            }
            // 重新加载鱼列表数据
        })
        .catch(error => {
            console.error('Error resting fish:', error);
        });
}


export const RefineFish = (fishId, callback) => {
    return api.post(FISH_REFINE_API_ENDPOINT, {fish_id: fishId})
        .then(response => {
            if (response.data.code === 0) {
                callback();
            } else {
                NotificationManager.error('', response.data.message, 3000, () => {
                    alert('callback');
                });
            }
            // 重新加载鱼列表数据
        })
        .catch(error => {
            console.error('Error resting fish:', error);
        });

}


export const CreateFish = (callback) => {
    return api.post(FISH_CREATE_API_ENDPOINT, {})
        .then(response => {
            if (response.data.code === 0) {
                NotificationManager.success('', '创建成功');
                callback(response.data.data);
            } else {
                NotificationManager.error('', response.data.message, 3000, () => {
                    alert('callback');
                });
            }
            // 重新加载鱼列表数据
        })
        .catch(error => {
            console.error('Error resting fish:', error);
        });
}

export const FetchFishParkingList = (callback) => {
    return api.post(FISH_PARKING_LIST_API_ENDPOINT, {})
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                callback(data.parking_list);
            } else {
                console.error('获取鱼位置信息失败：', response.data.message);
            }
        })
        .catch(error => {
            console.error('获取鱼位置信息失败：', error);
        });
};