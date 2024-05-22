import React, {useState, useEffect} from 'react';
import '../Login.css'
import ReactPager from 'react-pager';
import {
    useToast, VStack,
} from '@chakra-ui/react'
import {EmbedGodhead, FetchProps} from "../request/User";
import {FailedToast} from "../style/ShowToast";
import {GetGodheadIcon} from "../style/GodheadIconUtil";
import Bag from "./Bag";

function GodheadPropList({columns}) {
    const [props, setProps] = useState([]);
    const [propList, setPropList] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const toast = useToast()
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    useEffect(() => {
        FetchProps(currentPage, 1002, (propList, totalPage) => {
            setProps(propList);
            setTotalPages(totalPage);
        }, defaultFailedCallback).then();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const iconFunc = (prop) => {
        return GetGodheadIcon(prop.extra.level);
    }
    const useFunc = (prop) => {
        EmbedGodhead(prop.propId, defaultFailedCallback, () => {
           window.location.reload();
        }).then();
    };
    useEffect(() => {
        const propL = props.map(prop => {
            return {
                propId: prop.prop_id,
                propName: prop.prop_name,
                propRemark: prop.prop_remark,
                propImage: iconFunc(prop),
                useFunc: (pp) => useFunc(pp)
            };
        })
        setPropList(propL);
    }, [props]);

    return (
        <VStack>
            <Bag columns={columns} propList={propList} buttonText='佩戴'/>
            <ReactPager
                total={totalPages}
                current={currentPage}
                visiblePages={5}
                onPageChanged={handlePageChange}
                className="pagination" // 添加类名
            />
        </VStack>
    );
}

export default GodheadPropList;