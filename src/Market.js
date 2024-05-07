import React, {useState, useEffect} from 'react';
import './Login.css'
import ReactPager from 'react-pager';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    Stack,
    TableCaption,
    ModalOverlay,
    ModalContent,
    Modal,
    CardHeader,
    Heading,
    CardBody,
    Text,
    Card,
    useDisclosure,
} from '@chakra-ui/react'
import {Buy, FetchMarketDetail, FetchMarkets} from "./request/Market";
import {FormatTime} from "./style/TimeDisplayUtil";

function MarketList() {
    const [markets, setMarkets] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [detailData, setDetailData] = useState(null);
    const [buyModalIsOpen, setBuyModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure()

    useEffect(() => {
        FetchMarkets(currentPage, (markets, totalPage) => {
            if (markets !== undefined) {
                setMarkets(markets);
            }
            setTotalPages(totalPage);
        }).then();
    }, [currentPage]);



    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const closeDetailModal = () => {
        setDetailData(null);
        onClose();
    };

    const openBuyModal = (product_id, productName, price) => {
        let product = {product_id: product_id, name: productName, price: price}
        setSelectedProduct(product);
        setBuyModalIsOpen(true);
    };

    const closeBuyModal = () => {
        setSelectedProduct(null);
        setBuyModalIsOpen(false);
    };

    return (
        <TableContainer> {/* 使用容器包裹 */}
            <Table variant='simple'> {/* 使用表格包裹商品列表 */}
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
                        <Th>商品名称</Th>
                        <Th>修为</Th>
                        <Th>价格</Th>
                        <Th>剩余时间</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {markets.map(market => (
                        <Tr key={market.product_id}>
                            <Td>{market.fish_name}</Td>
                            <Td>{market.weight}</Td>
                            <Td>{market.price}</Td>
                            <Td>{FormatTime(market.sell_time_remain)}</Td>
                            <Td>
                                <Stack direction='row' align='center'>
                                    <Button colorScheme='teal' size='xs'
                                            onClick={() => FetchMarketDetail(market.product_id)}>详情</Button>
                                    <Button colorScheme='orange' size='xs'
                                            onClick={() => openBuyModal(market.product_id, market.fish_name, market.price)}>购买</Button>
                                </Stack>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                motionPreset='slideInBottom'
                size='xl'
            >
                <ModalOverlay/>
                <ModalContent>
                    {detailData != null && (
                        <Card padding={5}>
                            <CardHeader>
                                <Heading>
                                    {detailData.name}
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>修为：{detailData.weight}</Text>
                                <Text>生命：{detailData.heal}/{detailData.max_heal}</Text>
                                <Text>自愈：{detailData.recover_speed}</Text>
                                <Text>攻击：{detailData.atk}</Text>
                                <Text>防御：{detailData.def}</Text>
                                <Text>修炼：{detailData.earn_speed}</Text>
                                <Text>闪避：{detailData.dodge}</Text>
                                <Text>灵气：{detailData.money}</Text>
                            </CardBody>
                            <Stack direction='row'>
                                <Button colorScheme='orange'
                                        onClick={() => openBuyModal(detailData.product_id, detailData.name, detailData.price)}>购买
                                </Button>
                                <Button colorScheme='blue' onClick={closeDetailModal}>关闭</Button>
                            </Stack>
                        </Card>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                motionPreset='slideInBottom'
                size='6xl'
            >
                <ModalOverlay/>
                <ModalContent>
                    {detailData != null && (
                        <Card padding={5}>
                            <CardHeader>
                                <Heading>
                                    {detailData.name}
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>修为：{detailData.weight}</Text>
                                <Text>生命：{detailData.heal}/{detailData.max_heal}</Text>
                                <Text>自愈：{detailData.recover_speed}</Text>
                                <Text>攻击：{detailData.atk}</Text>
                                <Text>防御：{detailData.def}</Text>
                                <Text>修炼：{detailData.earn_speed}</Text>
                                <Text>闪避：{detailData.dodge}</Text>
                                <Text>灵气：{detailData.money}</Text>
                            </CardBody>
                            <Stack direction='row'>
                                <Button colorScheme='orange'
                                        onClick={() => openBuyModal(detailData.product_id, detailData.name, detailData.price)}>购买</Button>
                                <Button colorScheme='blue' onClick={closeDetailModal}>关闭</Button>
                            </Stack>
                        </Card>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                isOpen={buyModalIsOpen}
                onClose={closeBuyModal}
                isCentered
                motionPreset='slideInBottom'
                size='xl'
            >
                <ModalOverlay/>
                <ModalContent border={1}>
                    <Card padding={2}>
                        <CardHeader>
                            <Heading fontSize={30}>购买确认</Heading>
                        </CardHeader>
                        <CardBody>
                            {selectedProduct && (
                                <Text>消耗 {selectedProduct.price} 晶石购买【{selectedProduct.name}】吗？</Text>
                            )}
                            <Stack direction='row'>
                                <Button size='sm' colorScheme='orange' onClick={() => Buy(selectedProduct.product_id, () => {
                                    closeBuyModal();
                                })}>确认购买</Button>
                                <Button size='sm' colorScheme='blue' onClick={closeBuyModal}>取消</Button>
                            </Stack>
                        </CardBody>
                    </Card>
                </ModalContent>
            </Modal>
        </TableContainer>
    );
}

export default MarketList;