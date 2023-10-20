import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"

import Text from "./base/Text";
import "./SignupButton.css";

const SignupButton = ({ textGradient }: {
  textGradient?: boolean
}) => {
 
  return (
    <div className="signupButton">
      <Text size="large" weight="strong" color={ textGradient ? "gradient" : "white"}>
        Find your fit on Fitpix
      </Text>
    </div>
  )
};

export default SignupButton;
