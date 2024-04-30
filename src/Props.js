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
    Card,
    Table,
    TableCaption,
    Tr,
    Th,
    Thead,
    Td,
    Tbody,
    TableContainer,
} from '@chakra-ui/react'
import {EatProp, FetchProps} from "./request/User";

function PropList(incrExp) {
    const [props, setProps] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [eatModalIsOpen, setEatModalIsOpen] = useState(false);
    const [selectedProp, setSelectedProp] = useState(null);

    useEffect(() => {
        FetchProps(currentPage, (propList, totalPage) => {
            setProps(propList);
            setTotalPages(totalPage);
        }).then();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const openEatModal = (propId, propName) => {
        let prop = {prop_id: propId, prop_name: propName}
        setSelectedProp(prop);
        setEatModalIsOpen(true);
    };

    const closeEatModal = () => {
        setSelectedProp(null);
        setEatModalIsOpen(false);
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
                        <Th>名称</Th>
                        <Th>描述</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {props.map(prop => (
                        <Tr key={prop.prop_id}>
                            <Td>{prop.prop_name}</Td>
                            <Td>获得经验{prop.extra.experience}</Td>
                            <Td>
                                <Button colorScheme='orange' size='xs'
                                        onClick={() => openEatModal(prop.prop_id, prop.prop_name)}>使用</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <Modal
                isOpen={eatModalIsOpen}
                onClose={closeEatModal}
                isCentered
                motionPreset='slideInBottom'
                size='xl'
            >
                <ModalOverlay/>
                <ModalContent border={1}>
                    <Card padding={2}>
                        <CardHeader>
                            <Heading fontSize={30}>使用确认</Heading>
                        </CardHeader>
                        <CardBody>
                            {selectedProp && (
                                <Text>确定使用 【{selectedProp.prop_name}】吗？</Text>
                            )}
                            <Stack direction='row'>
                                <Button size='sm' colorScheme='orange'
                                        onClick={() => EatProp(selectedProp.prop_id, (data) => {
                                            const newProps = props.filter(prop => prop.prop_id !== selectedProp.prop_id);
                                            setProps(newProps);
                                            incrExp(data.exp);
                                            closeEatModal();
                                        })}>确认</Button>
                                <Button size='sm' colorScheme='blue' onClick={closeEatModal}>取消</Button>
                            </Stack>
                        </CardBody>
                    </Card>
                </ModalContent>
            </Modal>
        </TableContainer>
    );
}

export default PropList;