import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

import Image from "./base/Image";
import Text from "./base/Text";

import "./AppHeader.css";
import { logClick } from "../utils";

const AppHeader = ({ setModalOpen, cookie }) => {

  const onClick = () => {
    logClick("header", cookie);
    setModalOpen(true);
  }
 
  return (
    <div className="header">
      <Image src="logo-with-text.png" width="118px" height="32px" />
      <div className="headerSignupButton" onClick={onClick}>
        <Text size="small" weight="normal" color="black">Sign up</Text>
      </div>
    </div>
  )
};

export default AppHeader;
