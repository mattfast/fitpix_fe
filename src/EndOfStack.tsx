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


type User = {
  first_name: string;
  image_url: string;
  user_id: string;
}

type UserResponse = {
  user_list: User[];
  is_final: boolean;
}

const EndOfStack = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [prevActionIndex, setPrevActionIndex] = useState(0);
  const [pageUp, setPageUp] = useState<boolean>(false);
  const [totalScroll, setTotalScroll] = useState<number>(0);
  const [initialTouch, setInitialTouch] = useState<number>(0);
  const [currentTouch, setCurrentTouch] = useState<number>(0);
  const [usersListIndex, setUsersListIndex] = useState<number>(0);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isFinal, setIsFinal] = useState<boolean>(false);
  const [votingAppeared, setVotingAppeared] = useState<boolean>(false);
  const navigate = useNavigate();

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
    if (!cookies['user-id']) {
      navigate("/");
    }
  }, [])

  useEffect(() => {
    async function fetchUserList() {
      if (usersList.length < 24 && !isFinal && cookies['user-id']) {
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
        setIsFinal(users.is_final);
      }
    }

    fetchUserList();
  }, [usersList, cookies])

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
      <div className="voteContainer">
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
    </div>
  )
};

export default EndOfStack;
