import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik/500.css";
//import "@fontsource/rubik-mono-one/500.css"; 
//import "@fontsource/rubik-mono-one/700.css"; 
import "@fontsource/figtree/600.css";
import "./LandingPageImage.css";

const variants = {

};


/*

TODO:
- Add login button
- enable sign up button
- add fade out transition 
- Fit to different screen sizes
- Check for valid cookie + redirect to voting if present
- Switch from photo export to compiled photo div
*/

const LandingPageImage = () => {
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
    <div className="lpImageContainer">
      <div className="rankCol">
        <img src={process.env.PUBLIC_URL + "assets/2.png"} className="leaderboardImage" />
        <div className="barGraphColumn">
          <div className="height2">
            <img src={process.env.PUBLIC_URL + "assets/🥈.png"} className="medal" />
          </div>
        </div>
      </div>
      <div className="rankCol">
        <img src={process.env.PUBLIC_URL + "assets/1.png"} className="leaderboardImage" />
        <div className="barGraphColumn">
          <div className="height1">
            <img src={process.env.PUBLIC_URL + "assets/🥇.png"} className="medal" />
          </div>
        </div>

      </div>
      <div className="rankCol">
        <img src={process.env.PUBLIC_URL + "assets/3.png"} className="leaderboardImage" />
        <div className="barGraphColumn">
          <div className="height3">
            <img src={process.env.PUBLIC_URL + "assets/🥉.png"} className="medal" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default LandingPageImage;
