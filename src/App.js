// import logo from './logo.svg';
import './App.css';
import {Routes, Route, HashRouter as Router} from 'react-router-dom';
import Login from './Login';
import Playground from "./Playground";

// <div className="App">
//     <h1>鱼</h1>
//     <Login/> {/* 在父组件中引用登录页面组件 */}
// </div>

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/playground" element={<Playground/>} />
            </Routes>
        </Router>
    );
}

export default App;
