import * as echarts from 'echarts';
import {useEffect, useRef} from "react";
import {
    Box
} from "@chakra-ui/react";
function GrowthDetails({growthDetail, growthCountDetail, level}) {
    const chartRef = useRef(null);
    useEffect(() => {
        let chartInstance = echarts.init(chartRef.current, null, {
            width: 300,
            height: 250,
        });
        const option = {
            legend: {
                data: [
                    '最大',
                    '实际'
                ]
            },
            radar: {
                indicator: [
                    { name: '攻击', max: 540*(level-1) },
                    { name: '防御', max: 240*(level-1) },
                    { name: '生命', max: 3000*(level-1) },
                    { name: '自愈', max: 50*(level-1) },
                    { name: '修炼', max: 220*(level-1) }
                ],
            },
            series: [
                {
                    type: 'radar',
                    data: [
                        {
                            value: [540*growthCountDetail[1], 240*growthCountDetail[4], 3000*growthCountDetail[0], 50*growthCountDetail[2], 220*growthCountDetail[3]],
                            name: '最大'
                        },
                        {
                            value: [growthDetail[1], growthDetail[4], growthDetail[0], growthDetail[2], growthDetail[3]],
                            name: '实际'
                        }
                    ]
                },
            ]
        };
        chartInstance.setOption(option);
    }, []);
    return (
        <Box>
            <Box ref={chartRef}/>
        </Box>
    )
}

export default GrowthDetails;