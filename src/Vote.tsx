import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";
import { useSpring, animated } from 'react-spring';

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Vote.css";
import ImageModal from "./components/ImageModal";
import { validateCookie, s3_url } from "./utils";
import AppHeader from "./components/AppHeader";
import Cooldown from "./Cooldown";
import EndOfStack from "./EndOfStack";

type User = {
  first_name: string;
  last_name: string;
  user_id: string;
}

type UserResponse = {
  user_list: User[];
  feed_index: boolean;
  ready_at?: string;
}

function difference(date: Date) {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  
  const diffInSecs = Math.floor(diffInMs / 1000);
  const mins = Math.floor(diffInSecs / 60);
  const secs = diffInSecs % 60;

  return { mins, secs }
}

const Vote = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [userId, setUserId] = useState<string>("");
  const [feedIndex, setFeedIndex] = useState<number>(0);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalImage, setModalImage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [selectedSide, setSelectedSide] = useState<string>("");
  const navigate = useNavigate();

  const fadeAnimation = useSpring({
    opacity: transitioning ? 0 : 1,
    config: { tension: 320, friction: 40 }
  });

  const fadeAnimationReverse = useSpring({
    opacity: transitioning ? 1 : 1,
    config: { tension: 280, friction: 80 }
  });

  const refLeftImage = useRef<HTMLImageElement | null>(null);
  const refRightImage = useRef<HTMLImageElement | null>(null);
  const refLeftSelected = useRef<HTMLDivElement | null>(null);
  const refRightSelected = useRef<HTMLDivElement | null>(null);

  const updateRect = (
    ref1: React.MutableRefObject<HTMLImageElement | null>,
    ref2: React.MutableRefObject<HTMLDivElement | null>
  ) => {
    if (ref1.current && ref2.current) {
      console.log("ALIGNING DIVS");
      const rect = ref1.current.getBoundingClientRect();
      ref2.current.style.top = `${rect.top}px`;
      ref2.current.style.left = `${rect.left}px`;
      ref2.current.style.width = `${rect.width}px`;
      ref2.current.style.height = `${rect.height}px`;
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRect(refLeftImage, refLeftSelected);
    }, 100); // Poll every 100 milliseconds
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateRect(refRightImage, refRightSelected);
    }, 100); // Poll every 100 milliseconds
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function validate() {
      const user_id = await validateCookie(cookies['user-id']);
      if (user_id == "") {
        navigate("/");
      } else {
        setUserId(user_id);
      }
    }
    
    validate();
  }, [])

  const vote = async (winner_id: string, loser_id: string, selected_side: string) => {
    setSelectedSide(selected_side);
    setTransitioning(true);

    await fetch(
      `${process.env.REACT_APP_BE_URL}/post-decision`,
      {
        method: "POST",
        headers: {
          "auth-token": cookies['user-id'],
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "winner_id": winner_id,
          "loser_id": loser_id
        })
      }
    );
    //await new Promise(r => setTimeout(r, 1000));

    setFeedIndex(feedIndex + 2);
    setTransitioning(false);
  };

  useEffect(() => {
    async function fetchUserList() {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/generate-feed`,
        { 
          headers: {
            "auth-token": cookies['user-id'],
          }
        }
      );
      const users = await response.json();
      if (users.user_list.length > 0) {
        setUsersList([...usersList, ...users.user_list]);
        setFeedIndex(users.feed_index);
      } else if (users.ready_at) {
        const readyAt = new Date(users.ready_at);
        const { mins, secs } = difference(readyAt);
        setMinutesLeft(mins);
        setSecondsLeft(secs);
      }

      setLoading(false);
    }

    fetchUserList();
  }, [])
 
  return (
    <>
      <div className="voteContainer">
        <AppHeader page="vote" userId={userId} />
        { !loading && feedIndex < usersList.length - 1 && (
          <>
            <animated.div className="voteAreaContainer" style={fadeAnimation}>
              <div className="voteTextContainer">
                <div className="voteLimitText">
                  {Math.floor(feedIndex / 2) + 1} of {Math.floor(usersList.length / 2)}
                </div>
                <div className="voteQuestionText">
                  {usersList[feedIndex].first_name} or {usersList[feedIndex + 1].first_name}?
                </div>
              </div>
              <div className="optionsContainer">
                <div className="optionContainer">
                  <img src={s3_url(usersList[feedIndex].user_id)} ref={refLeftImage} className="optionImage" onClick={() => {
                    setModalImage(s3_url(usersList[feedIndex].user_id));
                    setShowModal(true);
                  }}/>
                  <div className="optionButton" onClick={() => vote(usersList[feedIndex].user_id, usersList[feedIndex + 1].user_id, "left")}>
                    {usersList[feedIndex].first_name}
                  </div>
                </div>
                <div className="optionContainer">
                  <img src={s3_url(usersList[feedIndex + 1].user_id)} ref={refRightImage} className="optionImage" onClick={() => {
                    setModalImage(s3_url(usersList[feedIndex + 1].user_id));
                    setShowModal(true);
                  }} />
                  <div className="optionButton" onClick={() => vote(usersList[feedIndex + 1].user_id, usersList[feedIndex].user_id, "right")}>
                    {usersList[feedIndex + 1].first_name}
                  </div>
                </div>
              </div>
            </animated.div>
          </>
        )}
        { !loading && minutesLeft !== null && secondsLeft !== null && (
          <Cooldown initialMins={minutesLeft} initialSecs={secondsLeft} />
        )}
        { !loading && feedIndex >= usersList.length - 1 && !minutesLeft && !secondsLeft && (
          <EndOfStack />
        )}
      </div>
      { selectedSide == "left" && transitioning && <animated.div ref={refLeftSelected} className="selectedContainer">
        <img className="checkmark" src={process.env.PUBLIC_URL + "assets/circle-check.png"} />
      </animated.div> }
      { selectedSide == "right" && transitioning && <animated.div ref={refRightSelected} className="selectedContainer">
        <img className="checkmark" src={process.env.PUBLIC_URL + "assets/circle-check.png"} />
      </animated.div> }
      <ImageModal imageSrc={modalImage} showModal={showModal} setShowModal={setShowModal} />
    </>
  )
};

export default Vote;
