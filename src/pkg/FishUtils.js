export function GetGrowthRequireMoney(currentLevel) {
    if (currentLevel <= 27) {
        // 注意：JavaScript中的除法会返回浮点数，如果需要整数结果，则需要进行Math.round()或Math.floor()
        return Math.round(800 * Math.pow(1.5, currentLevel) / 2);
    }

    // 先计算baseWeight，基于27级时的费用
    let baseWeight = Math.round(800 * Math.pow(1.5, 27) / 2);

    // 接着计算超过27级后的额外费用
    let extraCost = 4000000 * (1.0 + (currentLevel - 28) * 0.15);

    // 将两部分费用相加，并返回结果
    return baseWeight + Math.round(extraCost); // 根据需要决定是否要进行四舍五入
}