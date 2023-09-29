import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Leaderboard.css";
import { validateCookie } from "./utils";
import { s3_url } from "./utils";
import AppHeader from "./components/AppHeader";
import ImageModal from "./components/ImageModal";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const { userId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [userIdViewing, setUserIdViewing] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function validate() {
      const user_id = await validateCookie(cookies['user-id']);
      if (user_id == "") {
        navigate("/");
      } else {
        setUserIdViewing(user_id);
      }
    }
    
    validate();
  }, [])

  const logOut = () => {
    removeCookie("user-id");
    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
  }
 
  return (
    <>
      <div className="profileContainer">
        { !loading && (
          <>
            <AppHeader page="profile" userId={userIdViewing} />
            { userId == userIdViewing && (
              <div className="logOutButton" onClick={logOut}>
                Log Out
              </div>
            )}
          </>
        )}
      </div>
      { userId && <ImageModal imageSrc={s3_url(userId)} showModal={showModal} setShowModal={setShowModal} /> }
    </>
  )
};

export default Profile;

