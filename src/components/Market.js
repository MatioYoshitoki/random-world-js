import React, {useEffect, useState} from 'react';
import '../Login.css'
import ReactPager from 'react-pager';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    Stack,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import {Buy, FetchMarketDetail, FetchMarkets} from "../request/Market";
import {FormatTime} from "../style/TimeDisplayUtil";
import {FailedToast, SuccessToast} from "../style/ShowToast";
import FishHeader from "./FishHeader";
import FishBaseInfo from "./FishBaseInfo";
import {GetFishColorByRating} from "../style/ColorUtil";

function MarketList() {
    const [markets, setMarkets] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [detailData, setDetailData] = useState(null);
    const [buyModalIsOpen, setBuyModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure()
    const toast = useToast()
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    useEffect(() => {
        FetchMarkets(currentPage, (markets, totalPage) => {
            if (markets !== undefined) {
                setMarkets(markets);
            }
            setTotalPages(totalPage);
        }, defaultFailedCallback).then();
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
        <ModalBody>
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
                            <Th>名称</Th>
                            <Th>价格</Th>
                            <Th>时间</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {markets.map(market => (
                            <Tr key={market.product_id}>
                                <Td>
                                    <Link fontSize={15} color='teal.500' onClick={() => FetchMarketDetail(market.product_id, (data) => {
                                        setDetailData(data);
                                        onOpen();
                                    }, defaultFailedCallback)}>
                                        {market.fish_name}
                                    </Link>
                                </Td>
                                <Td>{market.price}</Td>
                                <Td>{FormatTime(market.sell_time_remain)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                <Modal
                    isOpen={isOpen}
                    onClose={closeDetailModal}
                    isCentered
                    motionPreset='slideInBottom'
                    size='xl'
                >
                    <ModalOverlay/>
                    <ModalContent>
                        {detailData != null && (
                            <Card padding={5} bg={GetFishColorByRating(detailData.fish.rating)}>
                                <CardHeader>
                                    <FishHeader fish={detailData.fish.fish}/>
                                </CardHeader>
                                <CardBody>
                                    <FishBaseInfo fish={detailData.fish.fish}/>
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
                                        SuccessToast('购买成功', toast);
                                        closeBuyModal();
                                    }, defaultFailedCallback)}>确认购买</Button>
                                    <Button size='sm' colorScheme='blue' onClick={closeBuyModal}>取消</Button>
                                </Stack>
                            </CardBody>
                        </Card>
                    </ModalContent>
                </Modal>
            </TableContainer>
        </ModalBody>
    );
}

export default MarketList;