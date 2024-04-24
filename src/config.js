// config.js

export const API_URL = 'http://192.168.12.78:8002'; // 设置 API 地址
const WS_URL = 'ws://192.168.12.78:7001'; // 设置 API 地址

export const AUTH_API_ENDPOINT = `/api/v0/auth`;
export const FISH_LIST_API_ENDPOINT = `/api/v1/fish/list`;
export const FISH_PULL_API_ENDPOINT = `/api/v1/fish/pull`;
export const FISH_SLEEP_API_ENDPOINT = `/api/v1/fish/sleep`;
export const FISH_ALIVE_API_ENDPOINT = `/api/v1/fish/alive`;
export const FISH_REFINE_API_ENDPOINT = `/api/v1/fish/refining`;
export const MARKET_LIST_API_ENDPOINT = `/api/v1/market/list`;
export const MARKET_DETAIL_API_ENDPOINT = `/api/v1/market/detail`;
export const MARKET_BUY_API_ENDPOINT = `/api/v1/market/buy`;
export const USER_ASSET_API_ENDPOINT = `/api/v1/user/asset`;
export const FISH_PARKING_LIST_API_ENDPOINT = "/api/v1/fish/parking/list"
export const BASE_WS_ENDPOINT = `${WS_URL}/v1/ws`;
