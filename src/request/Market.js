import api from "../BaseApi";
import {
    MARKET_BUY_API_ENDPOINT,
    MARKET_DETAIL_API_ENDPOINT,
    MARKET_LIST_API_ENDPOINT,
    MARKET_SELL_START_API_ENDPOINT,
    MARKET_SELL_STOP_API_ENDPOINT
} from "../config";
import {NotificationManager} from "react-notifications";

export const SellStart = (sellFish, price, sellDuration, asset, setAsset, callback) => {
    return api.post(MARKET_SELL_START_API_ENDPOINT, {
        fish_id: sellFish.id,
        price: price,
        sell_duration: sellDuration
    })
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                const commission = data.commission
                NotificationManager.success('', '上架成功! 扣除手续费' + commission + '晶石');
                setAsset({
                    ...asset,
                    gold: asset.gold - commission
                })
                callback();
            }
        })
        .catch(error => {
            console.error('上架失败：', error);
        })
};

export const SellStop = async (fishId, callback) => {
    return api.post(MARKET_SELL_STOP_API_ENDPOINT, {
        fish_id: fishId,
    })
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                NotificationManager.success('', '下架成功!');
                callback()
            } else {
                console.error('下架失败：', response.data.message);
            }
        })
        .catch(error => {
            console.error('下架失败：', error);
        })
};

export const FetchMarkets = (page, callback) => {
    return api.post(MARKET_LIST_API_ENDPOINT, {
        page: page,
        page_size: 20
    })
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                const {list, total_page} = data;
                console.log(list)
                if (list !== undefined) {
                    callback(list, total_page);
                }
            } else {
                console.error('Error fetching markets：', response.data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching markets:', error);
        })
};

export const FetchMarketDetail = (productId, callback) => {
    return api.post(MARKET_DETAIL_API_ENDPOINT, {product_id: productId})
        .then(response => {
            const {code, data} = response.data;
            if (code === 0) {
                data.product_id = productId;
                callback(data)
            } else {
                console.error('Error fetching markets：', response.data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching market detail:', error);
        });
};

export const Buy = async (productId, callback) => {
    return api.post(MARKET_BUY_API_ENDPOINT, {
        product_id: productId
    })
        .then(response => {
            if (response.data.code === 0) {
                // 购买成功
                NotificationManager.success('', '购买成功');
                window.location.reload()
            } else {
                // 购买失败
                NotificationManager.error('', response.data.message, 3000, () => {
                    alert('callback');
                });
            }
            callback();
        })
        .catch(error => {
            // 请求失败
            console.error('购买请求失败:', error);
            NotificationManager.error('', '购买失败', 3000, () => {
                alert('callback');
            });
            callback();
        })
};