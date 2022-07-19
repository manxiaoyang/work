import React from "react";
import './Rightbar.css';
import spaceshooter from "../images/spaceshooter.jpeg";
import netflix from "../images/netflix.jpeg";
import academy from "../images/academy.png";
import youtube from "../images/youtube.png";
import js from "../images/js.png";
import nftStorage from "../images/nftStorage.jpg";
import web3Storage from "../images/web3Storage.png";
import filecoinHK from "../images/filecoinHk.png";
import {Input} from "web3uikit"
import UpPets from "../components/UpPets";
const Rightbar = () => {


  return (
    <>
    <div className="rightbarContent">
      <div className="contentHead">
          置顶内容
      </div>
      <div className="contentMiddle">
          <UpPets/>
      </div>


      </div>
    </>
  );
};

export default Rightbar;

