import React, {useEffect,useState} from "react";
import "./UpPets.css";
import { Icon ,Button} from "web3uikit";
import {useMoralis} from "react-moralis";
import TweetInFeed from "../components/TweetInFeed.js"
//profile为接收的参数
const UpPets= () => {

    const [upPetsArr,setUpPetsArr] = useState();
    const {Moralis,account} = useMoralis();
    const user = Moralis.User.current();
    useEffect(()=>{
        async function getUpPets(){

            try {
                console.log(user);
                const UpPets = new Moralis.Object.extend("UpPets");
                const query = new Moralis.Query(UpPets);
                const results = await query.find();
                setUpPetsArr(results);
            }catch (e) {
                console.log(e);
            }
        }
        getUpPets();
        // setIsDown(false);
    },[TweetInFeed]);

    // const cancelUp = async (e) => {
    //     const upPets = new Moralis.Object.extend("UpPets");
    //     const query = new Moralis.Query(upPets);
    //     // query.equalTo("upPetId",e.attributes.upPetId);
    //     const result = await query.find();
    //     // result[0].remove("upPetId",e.attributes.upPetId);
    //     console.log(result[0]);
    //
    //
    //
    // }
    return (
        <>
            <div style={{height:'800px',overflow:'auto'}}>
                {upPetsArr?.map((e,index)=>{
                    return (
                        <div className="feedTweet" key={index} >
                            <img src={e.attributes.upPetPfp} className="profilePic"></img>
                            <div className="completeTweet">
                                <div className="who">
                                    {e.attributes.upPetUsername.substr(0,10)}
                                    <div className="accWhen">
                                        {
                                            `${e.attributes.upPetAddress.slice(0,4)}...${e.attributes.upPetAddress.slice(38)}
                                         ${e.attributes.createdAt.toLocaleString('en-us',{month:'short'})}
                                         ${e.attributes.createdAt.toLocaleString('en-us',{day:'numeric'})}
                                         `
                                        }
                                    </div>
                                </div>
                                <div>联系电话:{e.attributes.upPetPhone}</div>
                                <div className="tweetContent">
                                    宠物简介:
                                    {e.attributes.upPetTxt}
                                    {e.attributes.upPetImg&&(
                                        <img
                                            src={e.attributes.upPetImg}
                                            className="tweetImg">
                                        </img>
                                    )}
                                </div>

                            </div>
                        </div>
                    )
                }).reverse()
                }
            </div>
        </>
    );
};

export default UpPets;

