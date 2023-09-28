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
import { validateCookie } from "./utils";
import Cooldown from "./Cooldown";
import EndOfStack from "./EndOfStack";

const variants = {

};

type User = {
  first_name: string;
  image_url: string;
  user_id: string;
}

type UserResponse = {
  user_list: User[];
  cooldown_time: string;
  is_final: boolean;
}

function isInLast50Minutes(date: Date): boolean {
  const now = new Date(); // Get the current date and time
  const fiftyMinutesAgo = new Date(now.getTime() - 50 * 60 * 1000); // Calculate the time 50 minutes ago
  return date > fiftyMinutesAgo && date <= now; // Check if the given date is within the last 50 minutes
}

const Vote = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [prevActionIndex, setPrevActionIndex] = useState(0);
  const [pageUp, setPageUp] = useState<boolean>(false);
  const [totalScroll, setTotalScroll] = useState<number>(0);
  const [initialTouch, setInitialTouch] = useState<number>(0);
  const [currentTouch, setCurrentTouch] = useState<number>(0);
  const [usersListIndex, setUsersListIndex] = useState<number>(0);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [cooldownTime, setCooldownTime] = useState<Date | null>(null);
  const [isFinal, setIsFinal] = useState<boolean>(false);
  const [votingAppeared, setVotingAppeared] = useState<boolean>(false);
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

    if (usersListIndex >= usersList.length - 3) {
      // reached limit
    } else {
      setUsersListIndex(usersListIndex + 2);
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
      const users = await response.json() as UserResponse;
      setUsersList([...usersList, ...users.user_list]);
      setCooldownTime(new Date(users.cooldown_time));
      setIsFinal(users.is_final);
    }

    fetchUserList();
  }, [cookies])

  useEffect(() => {
    if (usersList.length > 0 && !votingAppeared) {
      setVotingAppeared(true);
    }
  }, [usersList])

  useEffect(() => {
    if (votingAppeared) {
      // TODO: intro animation
    }
  }, [votingAppeared])
 
  return (
    <div className="voteContainer">
      <div className="voteHeader">
        <div className="voteHeaderItems">
          <div className="leaderboardLink" onClick={() => navigate("/leaderboard")}>🏆</div>
          <div className="voteHeaderIcon">dopple.club</div>
          <img src={process.env.PUBLIC_URL + "assets/2.png"} className="profileLink" />
        </div>
      </div>
      { usersListIndex < usersList.length - 1 && (
        <div className="voteAreaContainer">
          <div className="voteTextContainer">
            <div className="voteLimitText">
              {(usersListIndex / 2) + 1} of {usersList.length / 2}
            </div>
            <div className="voteQuestionText">
              {usersList[usersListIndex].first_name} or {usersList[usersListIndex + 1].first_name}?
            </div>
          </div>
          <div className="optionsContainer">
            <div className="optionContainer">
              <img src={usersList[usersListIndex].image_url} className="optionImage" />
              <div className="optionButton" onClick={() => vote(usersList[usersListIndex].user_id, usersList[usersListIndex + 1].user_id)}>
                {usersList[usersListIndex].first_name}
              </div>
            </div>
            <div className="optionContainer">
              <img src={usersList[usersListIndex + 1].image_url} className="optionImage" />
              <div className="optionButton" onClick={() => vote(usersList[usersListIndex + 1].user_id, usersList[usersListIndex].user_id)}>
                {usersList[usersListIndex + 1].first_name}
              </div>
            </div>
          </div>
        </div>
      )}
      { (usersListIndex >= usersList.length - 1 && usersList.length == 24) || cooldownTime && (
        <Cooldown cooldownTime={cooldownTime}/>
      )}
      { usersListIndex >= usersList.length - 1 && usersList.length < 24 && (
        <EndOfStack />
      )}
    </div>
  )
};

export default Vote;
