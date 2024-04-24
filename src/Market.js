import React, {useState, useEffect} from 'react';
import {api} from './BaseApi'
import './Login.css'
import ReactPager from 'react-pager';
import {MARKET_BUY_API_ENDPOINT, MARKET_DETAIL_API_ENDPOINT, MARKET_LIST_API_ENDPOINT} from './config'; // 导入配置文件
import ReactModal from 'react-modal';
import {NotificationManager} from 'react-notifications';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
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
    useDisclosure, ModalHeader, ModalBody,
} from '@chakra-ui/react'

function MarketList() {
    const [markets, setMarkets] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [detailData, setDetailData] = useState(null);
    const [buyModalIsOpen, setBuyModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure()

    useEffect(() => {
        fetchMarkets(currentPage);
    }, [currentPage]);

    const fetchMarkets = async (page) => {
        try {
            const response = await api.post(MARKET_LIST_API_ENDPOINT, {
                page: page,
                page_size: 20
            });
            const {list, total_page} = response.data.data;
            if (list !== undefined) {
                setMarkets(list);
            }
            setTotalPages(total_page);
        } catch (error) {
            console.error('Error fetching markets:', error);
        }
    };

    const fetchMarketDetail = async (productId) => {
        try {
            const response = await api.post(MARKET_DETAIL_API_ENDPOINT, {product_id: productId});
            const {data} = response.data;
            data.product_id = productId;
            setDetailData(data);
            setSelectedProduct({product_id: productId, name: data.name, price: data.price});
            onOpen();
        } catch (error) {
            console.error('Error fetching market detail:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const closeDetailModal = () => {
        setDetailData(null);
        onClose();
    };

    const formatSellTime = (seconds) => {
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
    const openBuyModal = (product_id, productName, price) => {
        let product = {product_id: product_id, name: productName, price: price}
        setSelectedProduct(product);
        setBuyModalIsOpen(true);
    };

    const closeBuyModal = () => {
        setSelectedProduct(null);
        setBuyModalIsOpen(false);
    };

    const handleBuyConfirm = async () => {
        try {
            // 发起购买请求
            const response = await api.post(MARKET_BUY_API_ENDPOINT, {
                product_id: selectedProduct.product_id
            });
            if (response.data.code === 0) {
                // 购买成功
                NotificationManager.success('', '购买成功');
                window.location.reload()
            } else {
                // 购买失败
                NotificationManager.error('', response.data.message, 3000, () => {
                    alert('callback');
                });
            }
        } catch (error) {
            // 请求失败
            console.error('购买请求失败:', error);
            NotificationManager.error('', '购买失败', 3000, () => {
                alert('callback');
            });
        }
        closeBuyModal();
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
                            <Td>{formatSellTime(market.sell_time_remain)}</Td>
                            <Td>
                                <Stack direction='row' align='center'>
                                    <Button colorScheme='teal' size='xs'
                                            onClick={() => fetchMarketDetail(market.product_id)}>详情</Button>
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
                                <Button size='sm' colorScheme='orange' onClick={handleBuyConfirm}>确认购买</Button>
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