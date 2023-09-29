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
import { validateCookie } from "./utils";
import AppHeader from "./components/AppHeader";
import ImageModal from "./components/ImageModal";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function validate() {
      if (!(await validateCookie(cookies['user-id']))) {
        navigate("/");
      }
    }
    
    validate();
  }, [])

  const clickImage = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setShowModal(true);
  }
 
  return (
    <>
      <div className="profileContainer">
        { !loading && (
          <>
            <AppHeader page="profile" />
            <div className="leaderboard">
            </div>
          </>
        )}
      </div>
      <ImageModal imageSrc={currentImage} showModal={showModal} setShowModal={setShowModal} />
    </>
  )
};

export default Profile;

