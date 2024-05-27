// config.js

// export const API_URL = 'http://14.103.9.84:8002'; // 设置 API 地址
// const WS_URL = 'ws://14.103.9.84:7001'; // 设置 API 地址
export const API_URL = 'http://192.168.12.78:8002'; // 设置 API 地址
const WS_URL = 'ws://192.168.12.78:7001'; // 设置 API 地址

export const AUTH_API_ENDPOINT = `/api/v0/auth`;
export const CONFIGS_API_ENDPOINT = `/api/v1/user/configs`
export const FISH_LIST_API_ENDPOINT = `/api/v1/fish/list`;
export const FISH_PULL_API_ENDPOINT = `/api/v1/fish/pull`;
export const FISH_SLEEP_API_ENDPOINT = `/api/v1/fish/sleep`;
export const FISH_ALIVE_API_ENDPOINT = `/api/v1/fish/alive`;
export const FISH_CREATE_API_ENDPOINT = `/api/v1/fish/create`;
export const FISH_REFINE_API_ENDPOINT = `/api/v1/fish/refining`;
export const FISH_POOL_RANK_API_ENDPOINT = `/api/v1/fish/pool/rank`;
export const FISH_DEAD_RECORDS_API_ENDPOINT = `/api/v1/fish/dead_records`;
export const FISH_GODHEAD_DIVESTITURE_API_ENDPOINT = `/api/v1/fish/godhead/divestiture`;
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
export const USER_DESTROY_GODHEAD_API_ENDPOINT = `/api/v1/user/godhead/destroy`;
export const USER_EMBED_GODHEAD_API_ENDPOINT = `/api/v1/user/godhead/embed`;
export const USER_GODHEAD_LIST_API_ENDPOINT = `/api/v1/user/godhead/list`;
export const USER_CARD_API_ENDPOINT = `/api/v1/user/card`;
export const FISH_PARKING_LIST_API_ENDPOINT = "/api/v1/fish/parking/list"

export const MAIL_RECEIVED_API_ENDPOINT = `/api/v1/mail/received`;
export const MAIL_SEND_API_ENDPOINT = `/api/v1/mail/send`;
export const MAIL_RECEIVE_API_ENDPOINT = `/api/v1/mail/receive`;
export const MAIL_REMOVE_API_ENDPOINT = `/api/v1/mail/remove`;


export const BASE_WS_ENDPOINT = `${WS_URL}/v1/ws`;
