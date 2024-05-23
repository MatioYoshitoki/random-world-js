export function GetUserLevelUpRequired(level) {
    const configs = JSON.parse(localStorage.getItem('user_level_up_exp_required_configs'));
    if (level <= 40) {
        return configs[level];
    }
    const rate = Math.max(0, level-40)
    return 3000000 + rate*100000
}