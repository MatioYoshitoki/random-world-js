import {Button, Stack} from "@chakra-ui/react";
import SellCheckButton from "./SellCheckButton";
import RefiningCheckButton from "./RefiningCheckButton";
import DownSellCheckButton from "./DownSellCheckButton";
import React from "react";
import {AliveFish, SleepFish} from "../request/Fish";

function FishActionButtons({fish, fishList, fishParkingList, asset, setAsset, setFishParkingList, refreshFishList, defaultFailedCallback}) {
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

    const renderActionButtons = (fish) => {
        switch (fish.status) {
            case 0:
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='yellow.50' onClick={() => handleSleepClick(fish.id)}>休息</Button>
                </Stack>);
            case 1:
                return (
                    <Stack mt={3} direction='row' spacing={4} align='center'>
                        <Button bg='green.100'
                                onClick={() => handleAliveClick(fish.id)}>激活</Button>
                        <SellCheckButton fish={fish} setAsset={setAsset} asset={asset} refreshFishList={refreshFishList}
                                         setFishParkingList={setFishParkingList}/>
                        <RefiningCheckButton fish={fish} refreshFishList={refreshFishList}
                                             setFishParkingList={setFishParkingList} fishList={fishList}
                                             defaultFailedCallback={defaultFailedCallback}
                                             fishParkingList={fishParkingList}/>
                    </Stack>
                );
            case 2:
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <DownSellCheckButton fish={fish} refreshFishList={refreshFishList}
                                         setFishParkingList={setFishParkingList}/>
                </Stack>);
            case 3:
                return (
                    <Stack mt={3} direction='row' spacing={4} align='center'>
                        <RefiningCheckButton fish={fish} refreshFishList={refreshFishList}
                                             setFishParkingList={setFishParkingList} fishList={fishList}
                                             defaultFailedCallback={defaultFailedCallback}
                                             fishParkingList={fishParkingList}/>
                    </Stack>
                );
            default:
                return (<Stack mt={3} direction='row' spacing={4} align='center'>
                    <Button bg='yellow.50' onClick={() => handleSleepClick(fish.id)}>休息</Button>
                </Stack>);
        }
    }
    return renderActionButtons(fish)
}

export default FishActionButtons;