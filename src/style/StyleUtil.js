import CrazyFish from "../assets/user_skills/crazy_fish.svg";
import ShadowFish from "../assets/user_skills/shadow_fish.svg";

const effectAssetMap = {
    1: CrazyFish,
    2: ShadowFish
}

export function FishCardClassNameByStatus(status) {
    if (!status || status === 0) {
        return 'alive-fish';
    }
    return 'not-alive-fish';
}

export function FishEffectIconByEffectType(effectType) {
    return effectAssetMap[effectType]
}
