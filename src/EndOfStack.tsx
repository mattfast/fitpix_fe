import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Vote.css";
import ShareButton from "./components/ShareButton";

const EndOfStack = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const navigate = useNavigate();

  return (
    <div className="cooldownContainer">
      <div className="cooldownTextContainer">
        <div className="countdownText">
          end of da stack
        </div>
        <div className="orText">or</div>
      </div>
      <ShareButton />
    </div>
  );
};

export default EndOfStack;
