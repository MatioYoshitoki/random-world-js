export function GetUserLevelUpRequired(level) {
    const configs = JSON.parse(localStorage.getItem('user_level_up_exp_required_configs'));
    if (level <= 40) {
        return configs[level];
    }
    const rate = Math.max(0, level - 40)
    return 3000000 + rate * 100000
}

export function CheckInSpecial() {
    const tr = JSON.parse(localStorage.getItem('special_time_configs'));
    const nowMs = (new Date()).getTime();
    for (let r of tr.time_range) {
        if (CheckTimeInRange(nowMs, r.start_hour_minutes, r.end_hour_minutes)) {
            return r.name
        }
    }
    return '';
}

export function CheckTimeInRange(nowMs, startHourMinutes, endHourMinutes) {
    // 假设fish对象有一个属性bs.Game.MoonLightTime，它是一个数组，包含开始和结束时间字符串
    const today = new Date(nowMs).toLocaleDateString().split(',')[0]; // 获取当前日期（例如："2023-07-19"）
    const startDateStr = `${today}T${startHourMinutes}:00`; // 转换为ISO 8601格式的日期字符串（例如："2023-07-19T18:30:00"）
    const endDateStr = `${today}T${endHourMinutes}:00`;
    const startDate = new Date(startDateStr).getTime(); // 转换为毫秒时间戳
    const endDate = new Date(endDateStr).getTime();
    return startDate <= nowMs && endDate >= nowMs;
}