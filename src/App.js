// import logo from './logo.svg';
import './App.css';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Login';
import Playground from "./components/Playground";
import {ChakraProvider} from '@chakra-ui/react';
import {isBrowser, isMobile, isTablet} from 'react-device-detect';
import PlaygroundMobile from "./components/PlaygroundMobile";

function App() {
    return (
        <ChakraProvider toastOptions={{ defaultOptions: { position: 'top-left' } }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    {isMobile && <Route path="/playground" element={<PlaygroundMobile/>}/>}
                    {isBrowser && <Route path="/playground" element={<Playground/>}/>}
                    {isTablet && <Route path="/playground" element={<Playground/>}/>}
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
