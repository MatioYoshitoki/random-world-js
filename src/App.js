// import logo from './logo.svg';
import './App.css';
import {Routes, Route, HashRouter as Router} from 'react-router-dom';
import Login from './Login';
import Playground from "./Playground";
import 'react-notifications/lib/notifications.css';
import {ChakraProvider} from '@chakra-ui/react';
import {isMobile, isTablet, isBrowser} from 'react-device-detect';
import PlaygroundMobile from "./PlaygroundMobile";
import {useEffect} from "react";

function App() {
    useEffect(() => {
        console.log(isBrowser);
        console.log(isMobile);
        console.log(isTablet);
    }, []);
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    {isMobile && <Route path="/playground" element={<PlaygroundMobile/>}/>}
                    {isBrowser && <Route path="/playground" element={<Playground/>}/>}
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
