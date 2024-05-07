import React, {useState, useEffect} from 'react';
import './Login.css'
import ReactPager from 'react-pager';
import {
    Button,
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
import {NotificationManager} from "react-notifications";

function PropList({incrExp}) {
    const [props, setProps] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        FetchProps(currentPage, (propList, totalPage) => {
            setProps(propList);
            setTotalPages(totalPage);
        }).then();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                                        onClick={() => EatProp(prop.prop_id, (data) => {
                                            const newProps = props.filter(pt => pt.prop_id !== prop.prop_id);
                                            setProps(newProps);
                                            incrExp(data.exp, data.level_up_count);
                                        })}>使用</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

export default PropList;