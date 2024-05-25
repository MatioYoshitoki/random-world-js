import * as echarts from 'echarts';
import {useEffect, useRef} from "react";
import {
    Box,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    useDisclosure
} from "@chakra-ui/react";
import {QuestionOutlineIcon} from "@chakra-ui/icons";

function BehaviorDetails({behavior}) {
    const chartRef = useRef(null);
    useEffect(() => {
        let chartInstance = echarts.init(chartRef.current, null, {
            width: 300,
            height: 250,
        });
        const option = {
            legend: {
                left: 'center',
                top: 'bottom',
                // show: false,
                data: [
                    '攻击',
                    '休整',
                    '修炼',
                ]
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} :{d}%'
            },
            series: [
                {
                    name: '决策偏好',
                    type: 'pie',
                    radius: [20, 50],
                    roseType: 'radius',
                    itemStyle: {
                        borderRadius: 5
                    },
                    label: {
                        show: true,
                        formatter: '{d}%'
                    },
                    data: [
                        { value: behavior[0], name: '攻击' },
                        { value: behavior[1] - behavior[0], name: '休整' },
                        { value: behavior[2] - behavior[1], name: '修炼' },
                    ]
                },
            ]
        };
        chartInstance.setOption(option);
    }, [behavior]);
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-end'>
            <PopoverTrigger>
                <QuestionOutlineIcon maxW={3} onClick={onOpen}/>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader fontWeight='semibold'>决策偏好</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <Box ref={chartRef}/>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default BehaviorDetails;