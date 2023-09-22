import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik/500.css";
import "@fontsource/figtree/600.css";
import "./LandingPage.css";

import LandingPageImage from "./components/LandingPageImage";
import makeCookie from "./utils";
import Modal from "./Modal";

const variants = {

};


/*

TODO:
- Add login button
- enable sign up button
- add fade out transition 
- Fit to different screen sizes
- Check for valid cookie + redirect to voting if present
- add circle crop to central image
- fix touch bug with signup button
*/

const LandingPage = () => {
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
    if (cookies['user-id']) {
      navigate("/vote");
    }
  }, [cookies])
 
  return (
    <div className="container">
      <div className="contentContainer">
        <div className="textContainer">
          <div className="titleContainer">
            <div className="crown">👑</div>
            <div className="name">dopple.club</div>
          </div>
          <div className="subtitle">
            <div className="pink">Find</div> the 🤴 and 👸🏻 of <div className="pink">your class</div>
          </div>
        </div>
        <LandingPageImage />
        <div className="button" onClick={() => window.location.replace(`${process.env.REACT_APP_BASE_URL}/signup`)}>
          <div className="buttonText">
            Sign up
          </div>
        </div>
      </div>
    </div>
  )
};

export default LandingPage;
