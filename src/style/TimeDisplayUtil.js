export const FormatTime = (seconds) => {
    if (seconds < 60_000) {
        return `${seconds}秒`;
    } else if (seconds < 3600_000) {
        const minutes = Math.floor(seconds / 60_000);
        return `${minutes}分钟`;
    } else if (seconds < 86400_000) {
        const hours = Math.floor(seconds / 3600_000);
        const minutes = Math.floor((seconds % 3600_000) / 60_000);
        return `${hours}小时${minutes}分钟`;
    } else {
        const days = Math.floor(seconds / 86400_000);
        const remainingSeconds = seconds % 86400_000;
        const hours = Math.floor(remainingSeconds / 3600_000);
        const minutes = Math.floor((remainingSeconds % 3600_000) / 60_000);
        return `${days}天${hours}小时${minutes}分钟`;
    }
};