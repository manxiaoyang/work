import React from "react";
import './Settings.css';
import {Input} from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import { useState, useRef} from "react";
import pfp1 from "../images/pfp1.png";
import pfp2 from "../images/pfp2.png";
import pfp3 from "../images/pfp3.png";
import pfp4 from "../images/pfp4.png";
import pfp5 from "../images/pfp5.png";
import pfp6 from "../images/pfp6.jpg";
import pfp7 from "../images/pfp7.jpg";
import pfp8 from "../images/pfp8.jpg";
import pfp9 from "../images/pfp9.jpg";
import pfp10 from "../images/pfp10.jpg";

import {useMoralis} from "react-moralis";


const Settings = () => {
  const {Moralis,account,}  = useMoralis();
  const [selectedPFP, setSelectedPFP] = useState();
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState();
  const inputFile = useRef(null);
  //个人信息
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const pfps = [pfp1,pfp2,pfp3,pfp4,pfp5,pfp6,pfp7,pfp8,pfp9,pfp10];

  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };

  const saveEdits = async () => {
    //引入Moralis数据库中的表
    const User = Moralis.Object.extend("_User");
    const query = new Moralis.Query(User);
    const myDetails = await query.first();
    console.log(myDetails);
    if(bio){
      myDetails.set("bio",bio);
    }
    if(username) {
      myDetails.set("username",username);
    }
    if(selectedPFP){
      myDetails.set("pfp",selectedPFP);


      const Pets = new Moralis.Object.extend("Pets");
      const query = new Moralis.Query(Pets);
      query.equalTo("uploaderAcc",account);
      const results = await query.find();
      for(let i = 0; i < results.length ;i++){
        results[i].set("PetPfp",selectedPFP);
        await results[i].save();
      }


      const UpPets = new Moralis.Object.extend("UpPets");
      const query_UpPets = new Moralis.Query(UpPets);


      query_UpPets.equalTo("upPetAddress",account);
      const results_UpPets = await query_UpPets.find();
      for(let i = 0; i < results_UpPets.length ;i++){
        results_UpPets[i].set("upPetPfp",selectedPFP);
        await results_UpPets[i].save();
      }

    }
    if(theFile){
        const data = theFile;
        const file = new Moralis.File(data.name,data);
        await file.saveIPFS();
        myDetails.set("banner",file.ipfs());
    }
    await myDetails.save();
    window.location.reload();
  }

  return (
    <>
      <div className="pageIdentify">设置</div>

      <div className="settingsPage">
        <Input
          label="姓名"
          name="NameChange"
          width="100%"
          labelBgColor="#141d26"
          // value="name"
          onChange={(e)=> setUsername(e.target.value)}
        />

        <Input
          label="个人简介"
          name="bioChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="pfp">
          头像
          <div className="pfpOptions">
            {
              pfps.map((e,i)=>{
                return(
                <>
                  <img src={e}
                       key={i}
                      className={selectedPFP === e ? "pfpOptionSelected":"pfpOption"}
                      onClick={()=>setSelectedPFP(pfps[i])}>
                  </img>
                </>
                )
              })
            }
          </div>
        </div>

        <div className="pfp">
          个人中心背景图
          <div className="pfpOptions">
            <img
              src={selectedFile}
              onClick={onBannerClick}
              className="banner"
            ></img>
            <input
              type="file"
              name="file"
              ref={inputFile}
              onChange={changeHandler}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className="save" onClick={()=>saveEdits()}>
          保存
        </div>

      </div>

    </>
  );
};

export default Settings;

