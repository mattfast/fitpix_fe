import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";
import { useSpring, animated } from 'react-spring';

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Vote.css";
import ImageModal from "./components/ImageModal";
import { validateCookie, s3_url, difference } from "./utils";
import AppHeader from "./components/AppHeader";
import Cooldown from "./Cooldown";
import EndOfStack from "./EndOfStack";

type User = {
  first_name: string;
  last_name: string;
  user_id: string;
  regenerations: number;
}

type UserResponse = {
  user_list: User[];
  feed_index: boolean;
  ready_at?: string;
}

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

const Vote = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [searchParams, setSearchParams] = useSearchParams();

  const [userId, setUserId] = useState<string>("");
  const [feedIndex, setFeedIndex] = useState<number>(0);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [hoursLeft, setHoursLeft] = useState<number | null>(null);
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalImage, setModalImage] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [selectedSide, setSelectedSide] = useState<string>("");
  const navigate = useNavigate();

  const refLeftImage = useRef<HTMLImageElement | null>(null);
  const refRightImage = useRef<HTMLImageElement | null>(null);
  const refLeftSelected = useRef<HTMLDivElement | null>(null);
  const refRightSelected = useRef<HTMLDivElement | null>(null);

  const fadeAnimation = useSpring({
    opacity: transitioning ? 0 : 1,
    config: { tension: 320, friction: 40 }
  });

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

  useEffect(() => {
    async function mark_text_opened() {
      const text_id = searchParams.get("t");
      if (text_id) {
        const response = await fetch(
          `${process.env.REACT_APP_BE_URL}/mark-text-opened`,
          { 
            headers: {
              "auth-token": cookies['user-id'],
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "text_id": text_id
            })
          }
        );
      }
    }
    
    mark_text_opened();
  }, [searchParams])

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

    if (feedIndex + 2 >= 23) {
      setHoursLeft(0);
      setMinutesLeft(41);
      setSecondsLeft(0);
    }

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
        const { hours, mins, secs } = difference(readyAt);
        setHoursLeft(hours);
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
        { !loading && feedIndex < usersList.length - 1 && secondsLeft == null && (
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
                  <img src={s3_url(usersList[feedIndex].user_id, usersList[feedIndex].regenerations)} ref={refLeftImage} className="optionImage" onClick={() => {
                    setModalImage(s3_url(usersList[feedIndex].user_id, usersList[feedIndex].regenerations));
                    setShowModal(true);
                  }}/>
                  <div className="optionButton" onClick={() => vote(usersList[feedIndex].user_id, usersList[feedIndex + 1].user_id, "left")}>
                    {usersList[feedIndex].first_name}
                  </div>
                </div>
                <div className="optionContainer">
                  <img src={s3_url(usersList[feedIndex + 1].user_id, usersList[feedIndex].regenerations)} ref={refRightImage} className="optionImage" onClick={() => {
                    setModalImage(s3_url(usersList[feedIndex + 1].user_id, usersList[feedIndex].regenerations));
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
        { !loading && secondsLeft !== null && (
          <Cooldown initialHrs={hoursLeft} initialMins={minutesLeft} initialSecs={secondsLeft} />
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
