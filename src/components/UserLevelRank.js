import React, {useState, useEffect} from 'react';
import '../Login.css'
import ReactPager from 'react-pager';
import {Table, TableCaption, Tr, Th, Thead, Td, TableContainer, useToast} from '@chakra-ui/react'
import {FetchUserLevelRanks} from "../request/User";
import {FailedToast} from "../style/ShowToast";

function UserLevelRank() {
    const [userLevelRanks, setUserLevelRanks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const toast = useToast()
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    useEffect(() => {
        FetchUserLevelRanks(currentPage, (userLevelRanks, totalPage) =>{
            console.log(userLevelRanks);
            if (userLevelRanks !== undefined) {
                setUserLevelRanks(userLevelRanks.ranks);
            }
            setTotalPages(totalPage);
        }, defaultFailedCallback).then();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <TableContainer>
            <Table variant='simple' >
                <TableCaption mb={3}>
                    <ReactPager
                        total={totalPages}
                        current={currentPage}
                        visiblePages={1}
                        onPageChanged={handlePageChange}
                        className="pagination" // 添加类名
                    />
                </TableCaption>
                <Thead>
                    <Tr>
                        <Th>#.昵称</Th>
                        <Th>等级</Th>
                        <Th>经验值</Th>
                    </Tr>
                </Thead>
                {userLevelRanks.map(userLevelRank => (
                    <Tr key={userLevelRank.uid}>
                        <Td>{userLevelRank.rank}.{userLevelRank.username}</Td>
                        <Td>{userLevelRank.level}</Td>
                        <Td>{userLevelRank.exp}</Td>
                    </Tr>
                ))}
            </Table>
        </TableContainer>
    );
}

export default UserLevelRank;