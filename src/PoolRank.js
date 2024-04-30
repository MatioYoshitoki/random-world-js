import React, {useState, useEffect} from 'react';
import {api} from './BaseApi'
import './Login.css'
import ReactPager from 'react-pager';
import {
    FISH_POOL_RANK_API_ENDPOINT,
    USER_EAT_API_ENDPOINT,
    USER_PROPS_API_ENDPOINT
} from './config'; // 导入配置文件
import {NotificationManager} from 'react-notifications';
import {
    Button,
    Stack,
    ModalOverlay,
    ModalContent,
    Modal,
    CardHeader,
    Heading,
    CardBody,
    Text,
    Card, Table, TableCaption, Tr, Th, Thead, Td, useDisclosure,
} from '@chakra-ui/react'

function PoolRank() {
    const [poolRanks, setPoolRanks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedFish, setSelectedFish] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure()


    useEffect(() => {
        fetchPoolRanks(currentPage);
    }, [currentPage]);

    const fetchPoolRanks = async (page) => {
        try {
            const response = await api.post(FISH_POOL_RANK_API_ENDPOINT, {
                page: page,
                page_size: 10
            });
            const {list, total_page} = response.data.data;
            if (list !== undefined) {
                setPoolRanks(list);
            }
            setTotalPages(total_page);
        } catch (error) {
            console.error('Error fetching props:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleDetail = (poolRank) => {
        setSelectedFish(poolRank.fish);
        onOpen()
    };

    const closeDetail = () => {
        setSelectedFish(null);
        onClose()
    };

    const formatAliveTime = (seconds) => {
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

    return (
        <Table variant='simple' padding={5}> {/* 使用容器包裹 */}
            <TableCaption mb={3}>
                <ReactPager
                    total={totalPages}
                    current={currentPage}
                    visiblePages={5}
                    onPageChanged={handlePageChange}
                    className="pagination" // 添加类名
                />
            </TableCaption>
            <Thead>
                <Tr>
                    <Th>排名</Th>
                    <Th>名称</Th>
                    <Th>修为</Th>
                    <Th>主人</Th>
                    <Th>年龄</Th>
                </Tr>
            </Thead>
            {poolRanks.map(poolRank => (
                <Tr key={poolRank.fish_id}>
                    <Td>{poolRank.rank}</Td>
                    <Td>{poolRank.fish.name}</Td>
                    <Td>{poolRank.weight}</Td>
                    <Td>{poolRank.master_name}</Td>
                    <Td>{formatAliveTime(poolRank.alive_time_ms)}</Td>
                    <Td>
                        <Button colorScheme='teal' size='xs' onClick={() => handleDetail(poolRank)}>详情</Button>
                    </Td>
                </Tr>
            ))}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                motionPreset='slideInBottom'
                size='xl'
            >
                <ModalOverlay/>
                <ModalContent border={1}>
                    {selectedFish != null && (
                        <Card padding={5}>
                            <CardHeader>
                                <Heading>
                                    {selectedFish.name}
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>修为：{selectedFish.weight}</Text>
                                <Text>生命：{selectedFish.heal}/{selectedFish.max_heal}</Text>
                                <Text>自愈：{selectedFish.recover_speed}</Text>
                                <Text>攻击：{selectedFish.atk}</Text>
                                <Text>防御：{selectedFish.def}</Text>
                                <Text>修炼：{selectedFish.earn_speed}</Text>
                                <Text>闪避：{selectedFish.dodge}</Text>
                                <Text>灵气：{selectedFish.money}</Text>
                            </CardBody>
                            <Stack direction='row'>
                                <Button colorScheme='blue' onClick={closeDetail}>关闭</Button>
                            </Stack>
                        </Card>
                    )}
                </ModalContent>
            </Modal>
        </Table>
    );
}

export default PoolRank;