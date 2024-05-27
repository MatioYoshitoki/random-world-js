import React, {useEffect, useState} from 'react';
import '../Login.css'
import ReactPager from 'react-pager';
import {Center, Grid, GridItem, useToast, VStack} from '@chakra-ui/react'
import {EatProp, FetchProps} from "../request/User";
import {FailedToast} from "../style/ShowToast";
import Bag from "./Bag";
import PropIcon from "../assets/user_skills/refine_fish.svg";

function ExpPropList({columns, incrExp, pageSize}) {
    const [props, setProps] = useState([]);
    const [propList, setPropList] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const toast = useToast()
    const defaultFailedCallback = (message) => {
        FailedToast(message, toast);
    }

    useEffect(() => {
        FetchProps(currentPage, pageSize, 1001, (propList, totalPage) => {
            setProps(propList);
            setTotalPages(totalPage);
        }, defaultFailedCallback).then();
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const useFunc = (prop) => EatProp(prop.propId, (data) => {
        if (props.length === 1) {
            setProps([]);
            setPropList([]);
        } else {
            FetchProps(currentPage, pageSize, 1001, (propList, totalPage) => {
                setProps(propList);
                setTotalPages(totalPage);
            }, defaultFailedCallback).then();
        }

        incrExp(data.exp, data.level_up_count);
    }, defaultFailedCallback);

    const iconFunc = (prop) => {
        return PropIcon;
    }
    const getRemark = (prop) => {
        return prop.prop_name + '使用后增加' + prop.extra.experience + '灵气';
    }
    useEffect(() => {
        const propL = props.map(prop => {
            return {
                propId: prop.prop_id,
                propName: prop.prop_name,
                propRemark: getRemark(prop),
                propImage: iconFunc(prop),
                useFunc: (pp) => useFunc(pp)
            };
        })
        setPropList(propL);
    }, [props]);

    return (
        <VStack gap={10}>
            <Bag columns={columns} propList={propList} buttonText='使用'/>
            <ReactPager
                total={totalPages}
                current={currentPage}
                visiblePages={1}
                onPageChanged={handlePageChange}
                className="pagination" // 添加类名
            />
        </VStack>
    );
}

export default ExpPropList;