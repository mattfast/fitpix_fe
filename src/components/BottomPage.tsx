import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"

import Title from "./base/Title";
import Text from "./base/Text";
import SignupButton from "./SignupButton";
import Spacer from "./base/Spacer";

import "./BottomPage.css";
import { logClick } from "../utils";

const BottomPage = ({ setModalOpen, cookie }) => {
  const [userCount, setUserCount] = useState<number>(8);

  useEffect(() => {
    async function getUserCount() {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/user-count`,
        {
          method: "GET"
        }
      );
      const respJson = await response.json();
      console.log(respJson);

      if (respJson["user_count"] && respJson["user_count"] > 8) {
        setUserCount(respJson["user_count"]);
      }
    }

    getUserCount();
  }, [])

  const onClick = () => {
    logClick("bottom", cookie);
    setModalOpen(true);
  }
 
  return (
    <div className="bottomPageContainer">
      <Spacer gap={24}>
        <Spacer gap={16}>
          <Title level="primary">What are you waiting for?</Title>
          <Text size="large" weight="normal" color="white">Discover your new look.</Text>
        </Spacer>
        <SignupButton textGradient={false} onClick={onClick}/>
      </Spacer>
      <Spacer gap={8}>
        <div className="friendImages">
          <img src={ process.env.PUBLIC_URL + "assets/" + "friend_icons/1.png" } className="friendImage" style={{ zIndex: 5 }} />
          <img src={ process.env.PUBLIC_URL + "assets/" + "friend_icons/2.png" } className="friendImage" style={{ zIndex: 4 }} />
          <img src={ process.env.PUBLIC_URL + "assets/" + "friend_icons/3.png" } className="friendImage" style={{ zIndex: 3 }} />
        </div>
        <Text size="tiny" weight="normal" color="gray">
          {userCount}+ friends already joined
        </Text>
      </Spacer>
    </div>
  )
};

export default BottomPage;
