import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Rightbar from "./components/Rightbar";
import Upload from "./pages/Upload";
import {useMoralis} from "react-moralis";
import {Icon,ConnectButton,Button} from "web3uikit"

const App = () => {
    const {isAuthenticated,Moralis} = useMoralis();

  return (
    <>
        {isAuthenticated ? (     <div className="page">
            <div className="sideBar">
                <Sidebar />
                <div className="logout"
                     onClick={()=>{
                         Moralis.User.logOut().then(()=>{
                             window.location.reload();
                         })
                     }}>
                    登出
                </div>

            </div>
            <div className="mainWindow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/upload" element={<Upload />} />
                </Routes>
            </div>
            <div className="rightBar">
                <Rightbar/>
            </div>
        </div>):(
            <div className="loginPage">
                <Icon
                    fill="#000000"
                    size={32}
                    svg="metamask"
                />
                <ConnectButton />
            </div>

        )}
    </>
  );
};

export default App;
