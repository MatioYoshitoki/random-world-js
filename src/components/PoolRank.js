import React, {useState, useEffect} from 'react';
import '../Login.css'
import ReactPager from 'react-pager';
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
    Card,
    Table,
    TableCaption,
    Tr,
    Th,
    Thead,
    Td,
    useDisclosure,
    Tooltip,
    TableContainer,
    useToast,
} from '@chakra-ui/react'
import {FetchPoolRanks} from "../request/Fish";
import {FormatTime} from "../style/TimeDisplayUtil";
import {FailedToast} from "../style/ShowToast";
import {getFishLevelNameByLevel} from "../style/TextDisplayUtils";
import FishSkills from "./FishSkills";
import FishHeader from "./FishHeader";
import FishBaseInfo from "./FishBaseInfo";
import {GetFishColorByRating} from "../style/ColorUtil";

function PoolRank({rankType}) {
    const [poolRanks, setPoolRanks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedFish, setSelectedFish] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    useEffect(() => {
        FetchPoolRanks(rankType, currentPage, defaultFailedCallback, (poolRank, totalPage) =>{
            if (poolRank !== undefined) {
                setPoolRanks(poolRank);
            }
            setTotalPages(totalPage);
        }).then();
    }, [currentPage]);

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

    return (
        <TableContainer>
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
                        <Th>境界</Th>
                        <Th>击杀</Th>
                        <Th>主人</Th>
                        <Th>年龄</Th>
                    </Tr>
                </Thead>
                {poolRanks.map(poolRank => (
                    <Tr key={poolRank.fish_id}>
                        <Td>{poolRank.rank}</Td>
                        <Td>{poolRank.fish.fish.name}</Td>
                        <Td>{getFishLevelNameByLevel(poolRank.fish.fish.level)}</Td>
                        <Td>{poolRank.fish.fish.fish_statistics && poolRank.fish.fish.fish_statistics.kills}</Td>
                        <Td>{poolRank.master_name}</Td>
                        <Td>{FormatTime(poolRank.alive_time_ms)}</Td>
                        <Td>
                            <Button colorScheme='teal' size='xs' onClick={() => handleDetail(poolRank)}>详情</Button>
                        </Td>
                    </Tr>
                ))}
            </Table>
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
                        <Card padding={5}  bg={GetFishColorByRating(selectedFish.rating)}>
                            <CardHeader>
                                <FishHeader fish={selectedFish.fish}/>
                            </CardHeader>
                            <CardBody>
                                <FishBaseInfo fish={selectedFish.fish}/>
                            </CardBody>
                            <Stack direction='row'>
                                <Button colorScheme='blue' onClick={closeDetail}>关闭</Button>
                            </Stack>
                        </Card>
                    )}
                </ModalContent>
            </Modal>
        </TableContainer>
    );
}

export default PoolRank;