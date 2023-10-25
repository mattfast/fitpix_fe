import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"

import Title from "./base/Title";
import Text from "./base/Text";
import SignupButton from "./SignupButton";
import Spacer from "./base/Spacer";
import Image from "./base/Image";

import "./BottomPage.css";
import { logClick } from "../utils";

const Instructions = () => {
  return (
    <Image src="instructions.gif" width="min(80vw, 400px)" height="auto" />
  )
};

export default Instructions;
