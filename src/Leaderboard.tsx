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
import { validateCookie } from "./utils";
import AppHeader from "./components/AppHeader";

const leaderboard = [
  {
    "first_name": "Anna",
    "score": 59
  },
  {
    "first_name": "James",
    "score": 49
  },
  {
    "first_name": "Anna",
    "score": 59
  },
  {
    "first_name": "James",
    "score": 49
  },
  {
    "first_name": "Anna",
    "score": 59
  },
  {
    "first_name": "James",
    "score": 49
  },
  {
    "first_name": "Anna",
    "score": 59
  },
  {
    "first_name": "James",
    "score": 49
  },
  {
    "first_name": "Anna",
    "score": 59
  },
  {
    "first_name": "James",
    "score": 49
  },
  {
    "first_name": "Anna",
    "score": 59
  },
  {
    "first_name": "James",
    "score": 49
  },
  {
    "first_name": "Anna",
    "score": 59
  },
  {
    "first_name": "James",
    "score": 49
  },
  {
    "first_name": "Anna",
    "score": 59
  },
  {
    "first_name": "James",
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

  useEffect(() => {
    async function validate() {
      if (!(await validateCookie(cookies['user-id']))) {
        navigate("/");
      }
    }
    
    validate();
  }, [])
 
  return (
    <div className="leaderboardContainer">
      <AppHeader page="leaderboard"/>
      <div className="leaderboard">
        { leaderboard.map((l, i) => (
          <div className="leaderboardRow">
            { i == 0 && (
              <div className="leaderboardTopRank">
                🥇
              </div>
            )}
            { i == 1 && (
              <div className="leaderboardTopRank">
                🥈
              </div>
            )}
            { i == 2 && (
              <div className="leaderboardTopRank">
                🥉
              </div>
            )}
            { i > 2 && (
              <div className="leaderboardRank">
                #{i} 
              </div>
            )}
            <div className="leaderboardText">
              {l.first_name}
            </div>
            <img className="leaderboardImage" src={process.env.PUBLIC_URL + "assets/2.png"}/>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Leaderboard;
