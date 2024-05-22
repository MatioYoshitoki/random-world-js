import {
    FISH_ALIVE_API_ENDPOINT,
    FISH_CREATE_API_ENDPOINT, FISH_DEAD_RECORDS_API_ENDPOINT, FISH_GODHEAD_DIVESTITURE_API_ENDPOINT,
    FISH_LIST_API_ENDPOINT,
    FISH_PARKING_LIST_API_ENDPOINT,
    FISH_POOL_RANK_API_ENDPOINT,
    FISH_PULL_API_ENDPOINT,
    FISH_REFINE_API_ENDPOINT,
    FISH_SLEEP_API_ENDPOINT
} from "../config";
import api from "../BaseApi";

export const PullFish = (afterPull, failedCallback) => {
    return api.post(FISH_PULL_API_ENDPOINT, {})
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                afterPull(data.list)
                localStorage.setItem("ts_ms", data.ts_ms)
            } else {
                failedCallback(response.data.message);
            }
        })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        });
};

export const FetchFishList = (callback, failedCallback) => {
    return api.post(FISH_LIST_API_ENDPOINT, {})
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                callback(data.list);
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

export const SleepFish = (fishId, failedCallback, callback) => {
    return api.post(FISH_SLEEP_API_ENDPOINT, {fish_id: fishId})
        .then(response => {
            if (response.data.code === 0) {
                callback()
            } else {
                failedCallback(response.data.message);
            }
            // 重新加载鱼列表数据
        })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        });
}

export const AliveFish = (fishId, failedCallback, callback) => {
    return api.post(FISH_ALIVE_API_ENDPOINT, {fish_id: fishId})
        .then(response => {
            if (response.data.code === 0) {
                callback()
            } else {
                failedCallback(response.data.message);
            }
            // 重新加载鱼列表数据
        })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        });
}


export const RefineFish = (fishId, failedCallback, callback) => {
    return api.post(FISH_REFINE_API_ENDPOINT, {fish_id: fishId})
        .then(response => {
            if (response.data.code === 0) {
                callback();
            } else {
                failedCallback(response.data.message);
            }
            // 重新加载鱼列表数据
        })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        });

}


export const CreateFish = (callback, failedCallback) => {
    return api.post(FISH_CREATE_API_ENDPOINT, {})
        .then(response => {
            if (response.data.code === 0) {
                callback(response.data.data);
            } else {
                failedCallback(response.data.message);
            }
            // 重新加载鱼列表数据
        })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        });
}

export const FetchFishParkingList = (callback, failedCallback) => {
    return api.post(FISH_PARKING_LIST_API_ENDPOINT, {})
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                callback(data.parking_list);
            } else {
                failedCallback(response.data.message);
            }
        })
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        });
};

export const FetchPoolRanks = (rankType, page, failedCallback, callback) => {
    return api.post(FISH_POOL_RANK_API_ENDPOINT, {
        page: page,
        page_size: 10,
        rank_type: rankType
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
        .catch(error => {
            if (error.response) {
                failedCallback(error.response.message);
            }
        })
};

export const FetchFishDeadRecords = (fishId, callback) => {
    return api.post(FISH_DEAD_RECORDS_API_ENDPOINT, {
        fish_id: fishId
    })
        .then(response => {
            if (response.data.code === 0) {
                const {list} = response.data.data;
                if (list !== undefined) {
                    callback(list);
                }
            }
        })
        .catch(error => {
            if (error.response) {
                console.log(error.response.message);
            }
        })
};


export const DivestitureFishGodhead = (fishId, godheadId, failedCallback, callback) => {
    return api.post(FISH_GODHEAD_DIVESTITURE_API_ENDPOINT, {
        fish_id: fishId,
        godhead_id: godheadId
    })
        .then(response => {
            if (response.data.code === 0) {
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