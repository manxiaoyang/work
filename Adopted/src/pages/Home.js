import React from "react";
import "./Home.css";
import { useState, useRef} from "react";
import { defaultImgs } from "../defaultimgs";
import {TextArea, Icon,Input} from "web3uikit";
import TweetInFeed from "../components/TweetInFeed";
import {useMoralis,useWeb3ExecuteFunction} from "react-moralis";
import Adopted from "../contractsABis/Adopted.json"
import {ethers,BigNumber} from "ethers";
const Home = () => {
  const inputFile = useRef(null);
  const inputFileTxt = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [theFile, setTheFile] = useState();
  const [tweet, setTweet] = useState();
  //设置文件
  const [theTxt, setTheTxt] = useState();
  const[txtName,setTxtName] = useState();

  const{Moralis}  = useMoralis();
  const user = Moralis.User.current();
  //引入只能合约类

  const onImageClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };
   const onFileTxtClick = ()=>{
       inputFileTxt.current.click();
   }
  const changeFileHandler = (event) =>{
      const file = event.target.files[0];
      setTheTxt(file);
      setTxtName(file.name)
      console.log(file.name);
  }

  async function saveTweet(id) {
      if(!tweet) return ;
      //得到
      const Tweets = Moralis.Object.extend("Tweets");
      //新建一条数据
      const newTweet = new Tweets();
      //添加tweetID
      newTweet.set("tweetId",id);
      newTweet.set("tweetTxt",tweet);
      newTweet.set("tweeterPfp",user.attributes.pfp);
      newTweet.set("tweeterAcc",user.attributes.ethAddress);
      newTweet.set("tweeterUserName",user.attributes.username);
      if(theFile){
          const data = theFile;
          const file = new Moralis.File(data.name,data);
          await file.saveIPFS();
          newTweet.set("tweetImg",file.ipfs());
      }
      if(theTxt){
          const txt = theTxt;
          const fileTxt = new Moralis.File(txt.name,txt);
          await fileTxt.saveIPFS();
              newTweet.set("tweetFileTxt",fileTxt.ipfs());
      }

      await newTweet.save();
      window.location.reload();
  }

    async function saveTweet1() {
        if(!tweet) return ;
        //得到
        const Pets = Moralis.Object.extend("Pets");
        //新建一条数据
        const newPet = new Pets();
        //添加tweetID
        newPet.set("newPetTxt",tweet);
        newPet.set("newPetPfp",user.attributes.pfp);
        newPet.set("uploaderAcc",user.attributes.ethAddress);
        newPet.set("uploaderUserName",user.attributes.username);
        if(theFile){
            const data = theFile;
            const file = new Moralis.File(data.name,data);
            await file.saveIPFS();
            newPet.set("tweetImg",file.ipfs());
        }

        await newPet.save();
        window.location.reload();
    }


  async function ethersSave() {
      console.log(111111111);
      if(!tweet){
          return ;
      }
      let img;
      if(theFile){
          const data = theFile;
          const file = new Moralis.File(data.name,data);
          await file.saveIPFS();
          img = file.ipfs();

      }else{
          img = "no img"
      }
      let text;
      if(theTxt){
          const txtData = theTxt;
          const fileTxt = new Moralis.File(txtData.name,txtData);
          await fileTxt.saveIPFS();
          // newTweet.set("tweetFileTxt",fileTxt.ipfs());
          text = fileTxt.ipfs();
      }else{
          text = "no files"
      }
      //智能合约地址
      const contractAddress = "0xf9287Ac917e8b927393C808622cee3A8749C48b3";
      //存储提供者
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      //获取签名
      const signer = provider.getSigner();
      try{
          const contract =  new ethers.Contract(contractAddress,Adopted.abi,signer);
          const options = {value: ethers.utils.parseEther("0.1")};
          console.log(contract);
          console.log(contractAddress);
          let tx = await contract.addTweet(tweet,img,text,options);
          let rc = await tx.wait();
          let BigNumberFileIdHex = rc.events[0].args["id"]._hex;
          let tmp_id = BigNumber.from(BigNumberFileIdHex).toNumber();

          console.log(rc);
          alert("上传成功！");
          await saveTweet(tmp_id);
      }catch (e) {
          console.log("上传失败！");
      }


      // // saveTweet();
  }

  return (
    <>
    <div className="pageIdentify">领养中心</div>
      <div className="mainContent">

        <TweetInFeed profile={false}/>
      </div>
    </>
  );
};

export default Home;
