import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Leaderboard.css";
import makeCookie from "./utils";
import Modal from "./Modal";

const variants = {

};

const leaderboard = [
  {
    "name": "Anna",
    "score": 59
  },
  {
    "name": "James",
    "score": 49
  },
  {
    "name": "Anna",
    "score": 59
  },
  {
    "name": "James",
    "score": 49
  },
  {
    "name": "Anna",
    "score": 59
  },
  {
    "name": "James",
    "score": 49
  },
  {
    "name": "Anna",
    "score": 59
  },
  {
    "name": "James",
    "score": 49
  },
  {
    "name": "Anna",
    "score": 59
  },
  {
    "name": "James",
    "score": 49
  },
  {
    "name": "Anna",
    "score": 59
  },
  {
    "name": "James",
    "score": 49
  },
  {
    "name": "Anna",
    "score": 59
  },
  {
    "name": "James",
    "score": 49
  },
  {
    "name": "Anna",
    "score": 59
  },
  {
    "name": "James",
    "score": 49
  }
];

const Leaderboard = () => {
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
    <div className="leaderboardContainer">
      <div className="leaderboardHeader">
        <div className="leaderboardTitle">
          Leaderboard
        </div>
      </div>
      <div className="leaderboard">
        { leaderboard.map((l, i) => (
          <div className="leaderboardText">
            #{i + 1} {l.name} ({l.score} pts)
          </div>
        ))}
      </div>
    </div>
  )
};

export default Leaderboard;
