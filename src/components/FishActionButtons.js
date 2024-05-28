import {Button, HStack, Stack} from "@chakra-ui/react";
import SellCheckButton from "./SellCheckButton";
import RefiningCheckButton from "./RefiningCheckButton";
import DownSellCheckButton from "./DownSellCheckButton";
import React, {useEffect, useState} from "react";
import {AliveFish, SleepFish} from "../request/Fish";

function FishActionButtons({fish, fishList, fishParkingList, asset, setAsset, setFishParkingList, refreshFishList, defaultFailedCallback}) {
    const [fishStatus, setFishStatus] = useState(fish.status);
    useEffect(() => {
        setFishStatus(fish.status);
    }, [fish]);
    const handleSleepClick = (fishId) => {
        // 发送休息请求
        SleepFish(fishId, defaultFailedCallback, () => {
            const newFishList = [...fishList]
            for (let i = 0; i < newFishList.length; i++) {
                if (newFishList[i].fish.id === fishId) {
                    newFishList[i] = {
                        ...newFishList[i],
                        fish: {
                            ...newFishList[i].fish,
                            status: 1,
                        }
                    };
                    break;
                }
            }
            refreshFishList(newFishList)
        }).then();
    };

    const handleAliveClick = (fishId) => {
        // 发送休息请求
        AliveFish(fishId, defaultFailedCallback, () => {
            const newFishList = [...fishList]
            for (let i = 0; i < newFishList.length; i++) {
                if (newFishList[i].fish.id === fishId) {
                    newFishList[i] = {
                        ...newFishList[i],
                        fish: {
                            ...newFishList[i].fish,
                            status: 0
                        }
                    }
                    break;
                }
            }
            refreshFishList(newFishList)
        }).then();
    };
    return (<>
        {fishStatus === 0 && (<HStack mt={3} spacing={4} align='center'><Button bg='yellow.50' onClick={() => handleSleepClick(fish.id)}>休息</Button></HStack>)}
        {fishStatus === 1 && (<HStack mt={3} spacing={4} align='center'>
            <Button bg='green.100'
                    onClick={() => handleAliveClick(fish.id)}>激活</Button>
            <SellCheckButton fish={fish} setAsset={setAsset} asset={asset} refreshFishList={refreshFishList}
                             setFishParkingList={setFishParkingList}/>
            <RefiningCheckButton fish={fish} refreshFishList={refreshFishList}
                                 setFishParkingList={setFishParkingList} fishList={fishList}
                                 defaultFailedCallback={defaultFailedCallback}
                                 fishParkingList={fishParkingList}/>
        </HStack>)}
        {fishStatus === 2 && (<HStack mt={3} spacing={4} align='center'>
            <DownSellCheckButton fish={fish} refreshFishList={refreshFishList}
                                 setFishParkingList={setFishParkingList}/>
        </HStack>)}
        {fishStatus === 3 && (<HStack mt={3} spacing={4} align='center'>
            <RefiningCheckButton fish={fish} refreshFishList={refreshFishList}
                                 setFishParkingList={setFishParkingList} fishList={fishList}
                                 defaultFailedCallback={defaultFailedCallback}
                                 fishParkingList={fishParkingList}/>
        </HStack>)}
        {(fishStatus !== 0 && fishStatus !== 1 && fishStatus !== 2 && fishStatus !== 3) && (<HStack mt={3} spacing={4} align='center'>
            <Button bg='yellow.50' onClick={() => handleSleepClick(fish.id)}>休息</Button>
        </HStack>)}
    </>)
}

export default FishActionButtons;