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
import Modal from "./Modal";
import { validateCookie, s3_url } from "./utils";
import AppHeader from "./components/AppHeader";
import Cooldown from "./Cooldown";
import EndOfStack from "./EndOfStack";

type User = {
  first_name: string;
  image_url: string;
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
  const [feedIndex, setFeedIndex] = useState<number>(0);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function validate() {
      if (!(await validateCookie(cookies['user-id']))) {
        navigate("/");
      }
    }
    
    validate();
  }, [])

  const vote = async (winner_id: string, loser_id: string) => {
    fetch(
      `${process.env.REACT_APP_BE_URL}/post-decision`,
      {
        method: "POST",
        headers: {
          "auth-token": cookies['user-id'],
        },
        body: JSON.stringify({
          "winner_id": winner_id,
          "loser_id": loser_id
        })
      }
    );

    transitionAnimation();
  };

  const transitionAnimation = async () => {
    // TODO: implement animations

    if (feedIndex >= usersList.length - 3) {
      // reached limit
    } else {
      setFeedIndex(feedIndex + 2);
    }
  }

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
      if (users.user_list > 0) {
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
    <div className="voteContainer">
      <AppHeader page="vote" />
      { !loading && feedIndex < usersList.length - 1 && (
        <div className="voteAreaContainer">
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
              <img src={s3_url(usersList[feedIndex].user_id)} className="optionImage" />
              <div className="optionButton" onClick={() => vote(usersList[feedIndex].user_id, usersList[feedIndex + 1].user_id)}>
                {usersList[feedIndex].first_name}
              </div>
            </div>
            <div className="optionContainer">
              <img src={s3_url(usersList[feedIndex + 1].user_id)} className="optionImage" />
              <div className="optionButton" onClick={() => vote(usersList[feedIndex + 1].user_id, usersList[feedIndex].user_id)}>
                {usersList[feedIndex + 1].first_name}
              </div>
            </div>
          </div>
        </div>
      )}
      { !loading && minutesLeft !== null && secondsLeft !== null && (
        <Cooldown initialMins={minutesLeft} initialSecs={secondsLeft} />
      )}
      { !loading && feedIndex >= usersList.length - 1 && !minutesLeft && !secondsLeft && (
        <EndOfStack />
      )}
    </div>
  )
};

export default Vote;
