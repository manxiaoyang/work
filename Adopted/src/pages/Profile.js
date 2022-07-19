import React from "react";
import { Link } from "react-router-dom";
import './Profile.css';
import { defaultImgs } from "../defaultimgs";
import TweetInFeed from "../components/TweetInFeed";
import {useMoralis} from "react-moralis"
const Profile = () => {

  const {Moralis} = useMoralis();
  const user = Moralis.User.current();
  return (
    <>
      <div className="pageIdentify">个人中心</div>
      <img className="profileBanner" src={user.attributes.banner ? user.attributes.banner:defaultImgs[1]}></img>
      <div className="pfpContainner">
        <img className="profilePFP" src={user.attributes.pfp?user.attributes.pfp:defaultImgs[0]}></img>
        <div className="profileName">{user.attributes.username}</div>
        <div className="profileWallet">
          {`${user.attributes.ethAddress.slice(0,4)}...${user.attributes.ethAddress.slice(38)}`}</div>
        <div className="profileBio">
          {user.attributes.bio?user.attributes.bio:"未编写个人简介"}
        </div>
        <Link to="/settings">
          <div className="profileEdit">设置</div>
        </Link>
        <div className="profileTabs">
          <div className="profileTab">
              自己发布的领养记录
          </div>
        </div>

        <TweetInFeed profile={true}></TweetInFeed>
      </div>
    </>
  );
};

export default Profile;

