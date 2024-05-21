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
    TableContainer,
    Link,
    useToast,
} from '@chakra-ui/react'
import {FetchPoolRanks} from "../request/Fish";
import {FailedToast} from "../style/ShowToast";
import {getFishLevelNameByLevel} from "../style/TextDisplayUtils";
import FishSkills from "./FishSkills";
import {GetFishColorByRating} from "../style/ColorUtil";
import FishHeader from "./FishHeader";
import FishBaseInfo from "./FishBaseInfo";
import FishHeaderMobile from "./FishHeaderMobile";
import FishBaseInfoMobile from "./FishBaseInfoMobile";

function PoolRankMobile({rankType}) {
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
        <TableContainer maxWidth='100%' >
            <Table size='sm' variant='simple' padding={5}> {/* 使用容器包裹 */}
                <TableCaption mb={3}>
                    <ReactPager
                        total={totalPages}
                        current={currentPage}
                        visiblePages={3}
                        onPageChanged={handlePageChange}
                        className="pagination" // 添加类名
                    />
                </TableCaption>
                <Thead>
                    <Tr>
                        <Th>#.名称</Th>
                        {rankType === 1 && (<Th>击杀</Th>)}
                        {rankType === 0 && (<Th>境界</Th>)}
                        <Th>主人</Th>
                    </Tr>
                </Thead>
                {poolRanks.map(poolRank => (
                    <Tr key={poolRank.fish_id}>
                        <Td>
                            <Link fontSize={15} color='teal.500' onClick={() => handleDetail(poolRank)}>
                                {poolRank.rank}.{poolRank.fish.fish.name}
                            </Link>
                        </Td>
                        {rankType === 1 && poolRank.fish.fish.fish_statistics && (
                            <Td fontSize={14}>{poolRank.fish.fish.fish_statistics.kills}</Td>
                        )}
                        {rankType === 0 && (
                            <Td fontSize={14}>{getFishLevelNameByLevel(poolRank.fish.fish.level)}</Td>
                        )}
                        <Td fontSize={14}>{poolRank.master_name}</Td>
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
                            <Card padding={5}  bg={GetFishColorByRating(selectedFish.rating)}>
                                <CardHeader>
                                    <FishHeaderMobile fish={selectedFish.fish}/>
                                </CardHeader>
                                <CardBody>
                                    <FishBaseInfoMobile fish={selectedFish.fish}/>
                                </CardBody>
                                <Stack direction='row'>
                                    <Button colorScheme='blue' onClick={closeDetail}>关闭</Button>
                                </Stack>
                            </Card>
                        )}
                    </ModalContent>
                </Modal>
            </Table>
        </TableContainer>
    );
}

export default PoolRankMobile;