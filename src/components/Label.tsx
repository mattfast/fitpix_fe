import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"

import Text from "./base/Text";

import "./Label.css";

const Label = ({ text }) => {
 
  return (
    <div className="labelContainer">
      <Text size="tiny" weight="extraStrong" color="white">{text}</Text>
    </div>
  )
};

export default Label;
