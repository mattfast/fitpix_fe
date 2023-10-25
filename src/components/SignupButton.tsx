import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"

import Text from "./base/Text";
import "./SignupButton.css";

const SignupButton = ({ onClick, textGradient }: {
  onClick?: () => void;
  textGradient?: boolean;
}) => {
 
  return (
    <div className="signupButton" onClick={onClick}>
      <Text size="large" weight="strong" color={ textGradient ? "gradient" : "white"}>
        Shop for your fit
      </Text>
    </div>
  )
};

export default SignupButton;
