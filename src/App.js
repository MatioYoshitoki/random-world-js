// import logo from './logo.svg';
import './App.css';
import {Routes, Route, HashRouter as Router} from 'react-router-dom';
import Login from './Login';
import Playground from "./Playground";
import 'react-notifications/lib/notifications.css';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/playground" element={<Playground/>} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
