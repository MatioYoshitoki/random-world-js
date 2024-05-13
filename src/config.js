// config.js

// export const API_URL = 'http://14.103.9.84:8002'; // 设置 API 地址
// const WS_URL = 'ws://14.103.9.84:7001'; // 设置 API 地址
export const API_URL = 'http://127.0.0.1:8002'; // 设置 API 地址
const WS_URL = 'ws://127.0.0.1:7001'; // 设置 API 地址

export const AUTH_API_ENDPOINT = `/api/v0/auth`;
export const FISH_LIST_API_ENDPOINT = `/api/v1/fish/list`;
export const FISH_PULL_API_ENDPOINT = `/api/v1/fish/pull`;
export const FISH_SLEEP_API_ENDPOINT = `/api/v1/fish/sleep`;
export const FISH_ALIVE_API_ENDPOINT = `/api/v1/fish/alive`;
export const FISH_CREATE_API_ENDPOINT = `/api/v1/fish/create`;
export const FISH_REFINE_API_ENDPOINT = `/api/v1/fish/refining`;
export const FISH_POOL_RANK_API_ENDPOINT = `/api/v1/fish/pool/rank`;
export const USER_RANK_API_ENDPOINT = `/api/v1/user/rank`;
export const MARKET_LIST_API_ENDPOINT = `/api/v1/market/list`;
export const MARKET_DETAIL_API_ENDPOINT = `/api/v1/market/detail`;
export const MARKET_BUY_API_ENDPOINT = `/api/v1/market/buy`;
export const MARKET_SELL_START_API_ENDPOINT = `/api/v1/market/sell/start`;
export const MARKET_SELL_STOP_API_ENDPOINT = `/api/v1/market/sell/stop`;
export const USER_ASSET_API_ENDPOINT = `/api/v1/user/asset`;
export const USER_BASE_INFO_API_ENDPOINT = `/api/v1/user/info`;
export const USER_PROPS_API_ENDPOINT = `/api/v1/user/props`;
export const USER_EAT_API_ENDPOINT = `/api/v1/user/eat`;
export const USER_SKILLS_API_ENDPOINT = `/api/v1/user/skills`;
export const USER_SKILL_UPGRADE_API_ENDPOINT = `/api/v1/user/skill/upgrade`;
export const USER_FEED_FISH_API_ENDPOINT = `/api/v1/user/feed/fish`;
export const USER_HEAL_FISH_API_ENDPOINT = `/api/v1/user/heal/fish`;
export const USER_SHADOW_FISH_API_ENDPOINT = `/api/v1/user/shadow/fish`;
export const USER_CRAZY_FISH_API_ENDPOINT = `/api/v1/user/crazy/fish`;
export const USER_EXPAND_PARKING_API_ENDPOINT = `/api/v1/user/expand/parking`;
export const FISH_PARKING_LIST_API_ENDPOINT = "/api/v1/fish/parking/list"
export const BASE_WS_ENDPOINT = `${WS_URL}/v1/ws`;
