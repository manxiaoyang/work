import React, {useEffect,useState} from "react";
import "./TweetInFeed.css";
import filecoinOrbit from "../images/filecoinOrbit.jpeg";
import canoe from "../images/canoe.jpeg";
import { defaultImgs } from "../defaultimgs";
import pfp4 from "../images/pfp4.png";
import pfp5 from "../images/pfp5.png";
import { Icon ,Button} from "web3uikit";
import {useMoralis} from "react-moralis";
import Profile from "../pages/Profile.js";
import {BigNumber, ethers} from "ethers";
//profile为接收的参数
const TweetInFeed = (profile) => {

  const [PetArr,setPetArr] = useState();
  const {Moralis,account} = useMoralis();
  const user = Moralis.User.current();
  useEffect(()=>{
    async function getPets(){
      try {
        const Pets = new Moralis.Object.extend("Pets");
        const query = new Moralis.Query(Pets);
        if(profile.profile){
          query.equalTo("uploaderAcc",user.attributes.accounts[0]);
        }
        const results = await query.find();
        // alert(results.length)
        setPetArr(results);
      }catch (e) {
        console.log(e);
      }
    }
    getPets();
  },[Profile]);



  const setUp = async (e) => {
    console.log(e);
    const Pets = new Moralis.Object.extend("Pets");
    const query =  new Moralis.Query(Pets);
    query.equalTo("petId",e.attributes.petId)
    const result = await query.find();
    console.log(result);
    for(let i = 0 ; i< result.length ;i++)
    {
      result[i].set("isUped",true);
        await  result[i].save();
    }

    console.log(result[0].attributes.isUped);
    console.log("进入置顶函数")
    const UpPets = new Moralis.Object.extend("UpPets");
    const newUpPets = new UpPets();
    newUpPets.set("upPetAddress",e.attributes.uploaderAcc);
    newUpPets.set("upPetId",e.attributes.petId);
    newUpPets.set("upPetTxt",e.attributes.PetTxt);
    newUpPets.set("upPetPfp",e.attributes.PetPfp);
    newUpPets.set("upPetUsername",e.attributes.uploaderUserName);
    newUpPets.set("upPetPhone",e.attributes.uploaderPhone);
    newUpPets.set("upPetImg",e.attributes.PetImg);
    await newUpPets.save();
    window.location.reload();



  }
  return (
    <>
      {PetArr?.map((e,index)=>{
        return (
            <div className="feedTweet" key={index}>
              <img src={e.attributes.PetPfp ? e.attributes.PetPfp :defaultImgs[0]} className="profilePic"></img>
              {/*<a href="https://ipfs.moralis.io:2053/ipfs/QmZ29GxAwnXuSsXMpuHuU48rfqtT1MUMt5Ed4dKwjzsi94">地址</a>*/}
              <div className="completeTweet">
                <div className="who">
                  {e.attributes.uploaderUserName.slice(0,10)}
                    <div className="accWhen">
                      {
                        `${e.attributes.uploaderAcc.slice(0,4)}...${e.attributes.uploaderAcc.slice(38)}
                         ${e.attributes.createdAt.toLocaleString('en-us',{month:'short'})}
                         ${e.attributes.createdAt.toLocaleString('en-us',{day:'numeric'})}
                        `
                      }

                    </div>
                </div>
                <div>联系电话:{e.attributes.uploaderPhone}</div>
                <div className="tweetContent">
                  宠物简介:
                  {e.attributes.PetTxt}
                  {e.attributes.PetImg&&(
                      <img
                          src={e.attributes.PetImg}
                          className="tweetImg">
                      </img>
                  )}
                </div>
                <div className="interactions">
                  {!e.attributes.isUped&&<Button
                      id="test-button-primary"
                      onClick={setUp.bind(this, e)}
                      text="点击内容置顶"
                      theme="primary"
                      type="button"
                      size="small"
                  />}
                  {e.attributes.isUped&&<Button
                      id="test-button-primary"
                      text="内容已置顶"
                      theme="primary"
                      type="button"
                      size="small"
                      color="red"
                  />}
                </div>
              </div>
            </div>
        )
      }).reverse()
      }

    </>
  );
};

export default TweetInFeed;

