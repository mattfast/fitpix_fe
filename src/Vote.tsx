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
import makeCookie from "./utils";
import Modal from "./Modal";

const variants = {

};

const Vote = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [actionIndex, setActionIndex] = useState(0);
  const [sid, setSid] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [prevActionIndex, setPrevActionIndex] = useState(0);
  const [pageUp, setPageUp] = useState<boolean>(false);
  const [totalScroll, setTotalScroll] = useState<number>(0);
  const [initialTouch, setInitialTouch] = useState<number>(0);
  const [currentTouch, setCurrentTouch] = useState<number>(0);
  const navigate = useNavigate();
 
  return (
    <div className="voteContainer">
      <div className="voteHeader">
        <div className="voteHeaderItems">
          <div className="leaderboardLink">🏆</div>
          <div className="voteHeaderIcon">dopple.club</div>
          <img src={process.env.PUBLIC_URL + "assets/2.png"} className="profileLink" />
        </div>
      </div>
      <div className="voteContainer">
        <div className="voteTextContainer">
          <div className="voteLimitText">
            1 of 12
          </div>
          <div className="voteQuestionText">
            Anna or James?
          </div>
        </div>
        <div className="optionsContainer">
          <div className="optionContainer">
            <img src={process.env.PUBLIC_URL + "assets/anna.png"} className="optionImage" />
            <div className="optionButton">
              Anna
            </div>
          </div>
          <div className="optionContainer">
            <img src={process.env.PUBLIC_URL + "assets/james.png"} className="optionImage" />
            <div className="optionButton">
              James
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Vote;
