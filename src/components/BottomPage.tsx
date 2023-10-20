import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"

import Title from "./base/Title";
import Text from "./base/Text";
import SignupButton from "./SignupButton";
import Spacer from "./base/Spacer";

import "./BottomPage.css";

const BottomPage = () => {
 
  return (
    <div className="bottomPageContainer">
      <Spacer gap={24}>
        <Spacer gap={16}>
          <Title level="primary">What are you waiting for?</Title>
          <Text size="large" weight="normal" color="white">Discover your new look.</Text>
        </Spacer>
        <SignupButton textGradient={false} />
      </Spacer>
      <Spacer gap={8}>
        <Text size="tiny" weight="normal" color="gray">
          8+ friends already joined
        </Text>
      </Spacer>
    </div>
  )
};

export default BottomPage;
