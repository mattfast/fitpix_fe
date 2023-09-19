import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./LandingPage.css";
import makeCookie from "./utils";
import Modal from "./Modal";

const variants = {
  hidden: {
    opacity: [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0],
    y: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],
    x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    transition: {
      //delay: 2,
      duration: 0.3,
      //repeat: Infinity,
      //repeatDelay: 6,
    },
    transitionEnd: {
      x: 0,
      y: 50,
      opacity: 0
    }
  },

  visible: {
    opacity: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    y: [-45, -40, -35, -30, -25, -20, -15, -10, -5, 0],
    x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    transition: {
      duration: 0.2,
      //repeat: Infinity,
      //repeatDelay: 6,
    },
    transitionEnd: {
      y: 0,
      x: 0,
      opacity: 1
    }
  },

  pageUp: {
    y: "-100%",
    transition: {
      duration: 0.4,
    },
  }
};

const socket = io(process.env.REACT_APP_BACKEND_URL || "", { transports: ['websocket'] });

const actionWords = ["de-stress", "rant", "have fun"];

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
 
  const changeActionWord = async () => {
    setPrevActionIndex(actionIndex);
    setActionIndex((actionIndex + 1) % actionWords.length);
  }

  const wordCarousel = async () => {  
    await new Promise(resolve => setTimeout(resolve, 3000))
    changeActionWord();
  }

  const createOrSendCookie = async () => {
    let cookie = cookies["user-id"];
    if (!cookie) {
      cookie = makeCookie(32);
      setCookie("user-id", cookie, { expires: new Date(2030, 0) });
    }

    socket.emit("cookie", { "cookie": cookie, "sid": sid });
  }
  wordCarousel();

  window.addEventListener("wheel", function(e) {
    setTotalScroll(totalScroll + e.deltaY);
  });

  const handleTouchStart = (e) => {
    setInitialTouch(e.touches[0].screenY);
  }
  const handleTouchMove = (e) => {
    setCurrentTouch(e.touches[0].screenY);
  }

  useEffect(() => {
    socket.on("connection", (data) => {
      console.log("RECEIVED CONNECTION")
      console.log(data)
      setSid(data.sid as string);
      createOrSendCookie();
    });

    return () => {
      socket.off("connection");
    };
  }, []);

  useEffect(() => {
    if (totalScroll > 40) setPageUp(true);
  }, [totalScroll]);

  useEffect(() => {
    if (initialTouch - currentTouch > 40) setPageUp(true);
  }, [currentTouch]);
 
  return (
    <>
      <div className="background">
        <motion.div id="appContainer" className="appContainer" 
          initial={{ y: "0%" }}
          variants={variants}
          animate={pageUp && "pageUp"}
          onAnimationComplete={() => window.location.replace(process.env.REACT_APP_BASE_URL + "/chat")}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="centerContainer">
            <div className="title">
              Milk AI
            </div>
            <div className="innerContainer">
              <div className="tagline">
                The place for high schoolers to 
                { actionWords.map(w => (
                  <motion.div
                    className="actionWord"
                    variants={variants}
                    initial={{ opacity: 0 }}
                    animate={(actionWords[actionIndex] == w) ? "visible" : ((actionWords[prevActionIndex] == w) && "hidden")}
                  >
                    {(actionWords[actionIndex] == w || actionWords[prevActionIndex] == w) && w}
                  </motion.div>
                ))}
                <div className="logo">
                  <img className="milkLogo" src={process.env.PUBLIC_URL + "assets/Transparent.gif"} />
                  <img className="spinningText" src={process.env.PUBLIC_URL + "assets/spinning-text.png"} />
                </div>
              </div>
            </div>
            <div className="signUpButton" onClick={() => setModalOpen(true)}>
              <div className="signUpText">
                Sign Up
              </div>
            </div>
          </div>
          <div className="bottom" onClick={() => setPageUp(true)}>
            <div className="bottomText">Try it out first</div>
            <img className="arrow" src={process.env.PUBLIC_URL + "assets/arrow-down.png"} />
          </div>
        </motion.div>
      </div>
      <Modal open={modalOpen} buttonRef={null} sid={sid} cookie={cookies["user-id"]} socket={socket} setModalOpen={setModalOpen} isLandingPage={true} startPage={0} />
    </>
  )
};

export default LandingPage;
