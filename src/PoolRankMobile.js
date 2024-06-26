import React, {useState, useEffect} from 'react';
import './Login.css'
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
    Card, Table, TableCaption, Tr, Th, Thead, Td, useDisclosure, Tooltip, UnorderedList, ListItem, TableContainer, Link,
} from '@chakra-ui/react'
import {GetFishSkillColor} from "./style/ColorUtil";
import {FetchPoolRanks} from "./request/Fish";

function PoolRankMobile() {
    const [poolRanks, setPoolRanks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedFish, setSelectedFish] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure()


    useEffect(() => {
        FetchPoolRanks(currentPage, (poolRank, totalPage) =>{
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
                        <Th>境界</Th>
                        <Th>主人</Th>
                    </Tr>
                </Thead>
                {poolRanks.map(poolRank => (
                    <Tr key={poolRank.fish_id}>
                        <Td>
                            <Link fontSize={15} color='teal.500' onClick={() => handleDetail(poolRank)}>
                                {poolRank.rank}.{poolRank.fish.name}
                            </Link>
                        </Td>
                        <Td fontSize={14}>{poolRank.fish.level}</Td>
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
                            <Card padding={5}>
                                <CardHeader>
                                    <Heading>
                                        {selectedFish.name}
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    <Tooltip label={'修为:'+selectedFish.weight} placement='left'>
                                        <Text width='30%'>境界：{selectedFish.level}</Text>
                                    </Tooltip>
                                    <Text>性格：{selectedFish.personality_name}</Text>
                                    <Text>生命：{selectedFish.heal}/{selectedFish.max_heal}</Text>
                                    <Text>自愈：{selectedFish.recover_speed}</Text>
                                    <Text>攻击：{selectedFish.atk}</Text>
                                    <Text>防御：{selectedFish.def}</Text>
                                    <Text>修炼：{selectedFish.earn_speed}</Text>
                                    <Text>闪避：{selectedFish.dodge}</Text>
                                    <Text>灵气：{selectedFish.money}</Text>
                                    <Text width='15%'>技能：</Text>
                                    <UnorderedList width='30%'>
                                        {Array.isArray(selectedFish.fish_skills) && selectedFish.fish_skills.map(fishSkill => (
                                            <ListItem key={fishSkill.skill_id}>
                                                <Tooltip label={fishSkill.skill_desc} placement='left'>
                                                    <Text
                                                        textColor={GetFishSkillColor(fishSkill.skill_level)}>{fishSkill.skill_name}(Lv.{fishSkill.skill_level})</Text>
                                                </Tooltip>
                                            </ListItem>
                                        ))}
                                    </UnorderedList>
                                    {!Array.isArray(selectedFish.fish_skills) &&
                                        <Text>暂未觉醒技能</Text>}
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