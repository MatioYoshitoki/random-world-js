import api from "../BaseApi";
import {
    MARKET_BUY_API_ENDPOINT,
    MARKET_DETAIL_API_ENDPOINT,
    MARKET_LIST_API_ENDPOINT,
    MARKET_SELL_START_API_ENDPOINT,
    MARKET_SELL_STOP_API_ENDPOINT
} from "../config";

export const SellStart = (sellFish, price, sellDuration, asset, callback, failedCallback) => {
    return api.post(MARKET_SELL_START_API_ENDPOINT, {
        fish_id: sellFish.id,
        price: price,
        sell_duration: sellDuration
    })
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                callback(data.commission);
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

export const SellStop = async (fishId, callback, failedCallback) => {
    return api.post(MARKET_SELL_STOP_API_ENDPOINT, {
        fish_id: fishId,
    })
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                callback()
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

export const FetchMarkets = (page, callback, failedCallback) => {
    return api.post(MARKET_LIST_API_ENDPOINT, {
        page: page,
        page_size: 20
    })
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                const {list, total_page} = data;
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

export const FetchMarketDetail = (productId, callback, failedCallback) => {
    return api.post(MARKET_DETAIL_API_ENDPOINT, {product_id: productId})
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                data.product_id = productId;
                callback(data)
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

export const Buy = async (productId, callback, failedCallback) => {
    return api.post(MARKET_BUY_API_ENDPOINT, {
        product_id: productId
    })
        .then(response => {
            if (response.data.code === 0) {
                // 购买成功
                window.location.reload()
            } else {
                failedCallback(response.data.message);
            }
            callback();
        })
        .catch(error => {
            // 请求失败
            console.error('购买请求失败:', error);
            if (error.response) {
                failedCallback(error.response.message);
            }
            callback();
        })
};