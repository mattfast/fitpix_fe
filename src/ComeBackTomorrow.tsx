import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "./Cooldown.css";
import ShareButton from "./components/ShareButton";

const ComeBackTomorrow = () => {

  return (
    <div className="cooldownContainer">
      <div className="cooldownTextContainer">
        <div className="countdownText">
          Return tomorrow to see your dopple
        </div>
        <div className="orText">and</div>
      </div>
      <ShareButton />
    </div>
  );
};

export default ComeBackTomorrow;
