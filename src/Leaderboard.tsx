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
import { validateCookie, s3_url } from "./utils";
import AppHeader from "./components/AppHeader";
import ImageModal from "./components/ImageModal";

type LeaderboardUser = {
  user_id: string;
  first_name: string;
  last_name: string;
}

const Leaderboard = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [userId, setUserId] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const navigate = useNavigate();

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
    async function getLeaderboard() {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/get-leaderboard`,
        {
          method: "GET",
          headers: {
            "auth-token": cookies['user-id']
          }
        }
      )

      const respJson = await response.json();
      setLeaderboard(respJson["leaderboard"])
    }
    
    getLeaderboard();
  }, [])

  const clickImage = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setShowModal(true);
  }
 
  return (
    <>
      <div className="leaderboardContainer">
        <AppHeader page="leaderboard" userId={userId} />
        <div className="leaderboard">
          { leaderboard.map((l, i) => (
            <div className="leaderboardRow">
              <div className="leaderboardLeft">
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
                    #{i + 1} 
                  </div>
                )}
                <div className="leaderboardText" onClick={() => navigate(`/profile/${l.user_id}`)}>
                  {l.first_name} {l.last_name}
                </div>
              </div>
              <img className="leaderboardImage" src={s3_url(l.user_id)} onClick={() => clickImage(process.env.PUBLIC_URL + "assets/2.png")} />
            </div>
          ))}
        </div>
      </div>
      <ImageModal imageSrc={currentImage} showModal={showModal} setShowModal={setShowModal} />
    </>
  )
};

export default Leaderboard;
