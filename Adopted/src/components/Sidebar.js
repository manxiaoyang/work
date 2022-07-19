import React from "react";
import './Sidebar.css';
import {Link} from 'react-router-dom';
import {Logo, Icon} from "web3uikit";
import ipfsLogo from "../images/ipfs-logo.png";
import { defaultImgs } from "../defaultimgs";
import {useMoralis} from "react-moralis";
const Sidebar = () => {

    const {Moralis} = useMoralis();
    const user = Moralis.User.current();
  return (
    <>
     <div className="siderContent">
      <div className="menu">
        <div className="details">
            <Logo theme="icon" color="blue" size="regular"/>
            <Logo theme="icon" color="blue" size="regular"/>
          <Logo theme="icon" color="blue" size="regular"/>
        </div>

        <Link to="/" className="link">
          <div className="menuItems">
              <Icon
                  fill="#000000"
                  size={33}
                  svg="doge"
              />
            领养中心
          </div>
        </Link>
        <Link to="/profile" className="link">
          <div className="menuItems">
              <Icon
                  fill="#000000"
                  size={33}
                  svg="doge"
              />
            个人中心
          </div>
        </Link>

        <Link to="/settings" className="link">
          <div className="menuItems">
              <Icon
                  fill="#000000"
                  size={33}
                  svg="doge"
              />
            设置
          </div>
        </Link>
          <Link to="/upload" className="link">
              <div className="menuItems">

                  <Icon
                      fill="#000000"
                      size={33}
                      svg="doge"
                  />
                  发布
              </div>
          </Link>
      </div>

      <div className="details">
          <img src={user.attributes.pfp?user.attributes.pfp:defaultImgs[0]} className="profilePic"></img>
          <div className="profile">
            <div className="who">
                {user.attributes.username}
            </div>
            <div className="accWhen">
                {`${user.attributes.ethAddress.slice(0,4)}...${user.attributes.ethAddress.slice(38)}`}
            </div>
          </div>
      </div>

     </div>
    </>
  );
};

export default Sidebar;

