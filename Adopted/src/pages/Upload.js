import React from "react";
import "./Upload.css";
import { useState, useRef} from "react";
import { defaultImgs } from "../defaultimgs";
import {TextArea, Icon,Input} from "web3uikit";
import {useMoralis,useWeb3ExecuteFunction} from "react-moralis";
import Adopted from "../contractsABis/Adopted.json"
import {ethers,BigNumber} from "ethers";
const Upload = () => {
    const inputFile = useRef(null);
    const [selectedFile, setSelectedFile] = useState();
    const [theFile, setTheFile] = useState();
    const[introduction,setIntroduction] = useState();

    const[phone,setPhone] = useState();

    const{Moralis}  = useMoralis();
    const user = Moralis.User.current();

    const onImageClick = () => {
        inputFile.current.click();
    };

    const changeHandler = (event) => {
        const img = event.target.files[0];
        setTheFile(img);
        setSelectedFile(URL.createObjectURL(img));
    };

    async function  savePet(id) {
        console.log("输入保存")
        if(!introduction) return ;
        //得到
        const Pets = Moralis.Object.extend("Pets");
        //新建一条数据
        const newPet = new Pets();
        //添加tweetID
        newPet.set("petId",id);
        newPet.set("PetTxt",introduction);
        newPet.set("PetPfp",user.attributes.pfp);
        newPet.set("uploaderAcc",user.attributes.ethAddress);
        newPet.set("uploaderUserName",user.attributes.username);
        //是否置顶
        newPet.set("isUped",false);
        if(theFile){
            const data = theFile;
            const file = new Moralis.File(data.name,data);
            await file.saveIPFS();
            newPet.set("PetImg",file.ipfs());
        }
        if(phone){
            newPet.set("uploaderPhone",phone);
        }

        console.log(newPet);
        await newPet.save();
        window.location.reload();
    }
    async function ipfsSave() {
            console.log("ipfs保存");
            if(!introduction){
                return ;
            }
            let img;
            if(theFile){
                const data = theFile;
                const file = new Moralis.File(data.name,data);
                await file.saveIPFS();
                img = file.ipfs();
            }else{
                img = "do not have img"
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
                let tx = await contract.addPet(introduction,img,options);
                let rc = await tx.wait();
                let BigNumberFileIdHex = rc.events[0].args["petId"]._hex;
                let id = BigNumber.from(BigNumberFileIdHex).toNumber();
                console.log(rc);
                alert("上传成功！");
                await savePet(id);
            }catch (e) {
                console.log(e);
                console.log("上传失败！");
            }

    }



    return (
        <>
            <div className="pageIdentify" >
                <img
                    src={user.attributes.pfp} className="profilePic" >
                </img>
                发布领养
            </div>
            <div className="mainContent">
                <div className="jianjie_1">
                    联系电话

                    <Input
                        label="手机号"
                        name="Test text Input"
                        // onBlur={function noRefCheck(){}}
                        onChange={(e)=>setPhone(e.target.value)}
                        // placeholder="请输入一个电话"
                        value={phone}
                    />
                </div>
                <div className="profileTweet">


                    <div className="jianjie">
                        宠物简介简介
                    </div>
                    <div className="tweetBox">
                        <TextArea
                            state="confirmed"
                            label="宠物简介"
                            placeholder="请输入宠物简介"
                            name="tweetTextArea"
                            type="text"
                            width="95%"
                            onChange={(e) => setIntroduction(e.target.value)}>
                        </TextArea>
                        {selectedFile && (
                            <img src={selectedFile} className="tweetImg"></img>
                        )}

                        <div className="imgOrTweet">
                            <div className="imgDiv" onClick={onImageClick}>
                                <input
                                    type="file"
                                    name="file"
                                    ref={inputFile}
                                    onChange={changeHandler}
                                    style={{ display: "none"}}
                                />
                                <Icon fill="#1DA1F2" size={20} svg="image"></Icon>

                            </div>

                            <div className="tweetOptions">
                                <div className="tweet" onClick={ipfsSave}>发布领养</div>
                                {/*<div className="tweet" onClick={ipfsSave} style={{ backgroundColor: "#8247e5" }}>*/}
                                {/*    <Icon fill="#ffffff" size={20} svg="matic" />*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </>
    );
};

export default Upload;
