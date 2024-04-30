import api from "../BaseApi";
import {MARKET_SELL_START_API_ENDPOINT, MARKET_SELL_STOP_API_ENDPOINT} from "../config";
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