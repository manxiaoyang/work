// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Adopted{
    address public owner;
    uint private counter;

    constructor(){
        counter = 0;
        owner = msg.sender;
    }
    // 宠物结构体
    struct pet{
        // 领养发布者
        address uploader;
        uint petId;
        string petText;
        string petImg;
    }

    event getPetData(
        address uploader,
        uint petId,
        string petText,
        string petImg
    );

    mapping(uint256 => pet) pets;

    function getPet(uint256 id)public view returns(string memory,string memory,address){
        require(id < counter,"No such pet");
        pet storage item = pets[id];
        return (item.petText, item.petImg,item.uploader);

    }
    function addPet(string memory text,string memory img)public payable{
        require(msg.value == (0.1 ether),"please give money for upload");
        pet storage newPet = pets[counter];
        newPet.petText = text;
        newPet.petImg = img;
        newPet.uploader = msg.sender;
        newPet.petId = counter;

        emit getPetData(msg.sender,counter,text,img);
        counter++;
        //        把钱转给owner
        payable(owner).transfer(msg.value);


    }

}
