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
    const now = new Date(nowMs);
    const nowHour = now.getHours();
    const nowMinute = now.getMinutes();

    // 拆分字符串为小时和分钟
    const startParts = startHourMinutes.split(":");
    const endParts = endHourMinutes.split(":");

    // 转换为整数
    const startHour = parseInt(startParts[0], 10);
    const startMinute = parseInt(startParts[1], 10);
    const endHour = parseInt(endParts[0], 10);
    const endMinute = parseInt(endParts[1], 10);

    // 检查当前时间是否在月光时间范围内
    if (nowHour > startHour && nowHour < endHour) {
        return true;
    } else if (nowHour === startHour) {
        return nowMinute >= startMinute;
    } else if (nowHour === endHour) {
        return nowMinute <= endMinute;
    }
    return false;
}