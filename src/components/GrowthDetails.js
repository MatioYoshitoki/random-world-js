import * as echarts from 'echarts';
import {useEffect, useRef} from "react";
import {Box} from "@chakra-ui/react";

function GrowthDetails({fish}) {
    const chartRef = useRef(null);

    useEffect(() => {
        const growthCountDetail = fish.fish_statistics.growth_count_detail;
        const level = fish.level;
        let currentData = [
            {
                value: [fish.atk, fish.def, fish.max_heal, fish.recover_speed, fish.earn_speed],
                name: '实际',
                areaStyle: {
                    color: '#38A169'
                },
                lineStyle: {
                    color: '#38A169'
                }
            },
            {
                value: [499 + 540 * growthCountDetail[1], 269 + 240 * growthCountDetail[4], 14999 + 3000 * growthCountDetail[0], 100 + 50 * growthCountDetail[2], 79 + 220 * growthCountDetail[3]],
                name: '最大',
                lineStyle: {
                    color: '#DD6B20'
                }
            },
        ];
        let growthCountSum = growthCountDetail[1] + growthCountDetail[4] + growthCountDetail[0] + growthCountDetail[2] + growthCountDetail[3]
        if (growthCountSum !== (level - 1)) {
            currentData = [];
        }
        let chartInstance = echarts.init(chartRef.current, null, {
            width: 200,
            height: 200,
        });
        const option = {
            legend: {
                show: false,
                data: [
                    '最大',
                    '实际'
                ],
            },
            tooltip: {
                trigger: 'item'
            },
            radar: {
                indicator: [
                    {name: '攻击', max: 499 + 540 * (level - 1) / 5},
                    {name: '防御', max: 269 + 240 * (level - 1) / 5},
                    {name: '生命', max: 14999 + 3000 * (level - 1) / 5},
                    {name: '自愈', max: 100 + 50 * (level - 1) / 5},
                    {name: '修炼', max: 79 + 220 * (level - 1) / 5}
                ],
                radius: 65,
                center: ['50%', '50%'],
                axisName: {
                    formatter: '{value}',
                    color: '#C53030',
                },
                splitArea: {
                    areaStyle: {
                        color: ['#EDF2F7']
                    }
                },
            },
            series: [
                {
                    type: 'radar',
                    lineStyle: {
                        width: 1,
                        opacity: 0.5
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    symbol: 'none',
                    data: currentData,
                },
            ]
        };
        chartInstance.setOption(option);
    }, [fish]);
    return (
        <Box>
            <Box ref={chartRef}/>
        </Box>
    )
}

export default GrowthDetails;