import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Profile.css";
import { validateCookie } from "./utils";
import { s3_url } from "./utils";
import AppHeader from "./components/AppHeader";
import ImageModal from "./components/ImageModal";
import ThemeArea from "./components/ThemeArea";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const { userId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [userIdViewing, setUserIdViewing] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [themes, setThemes] = useState<string[]>([]);
  const [newThemes, setNewThemes] = useState<string[]>([]);
  const [selectingThemes, setSelectingThemes] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
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

  useEffect(() => {
    async function retrieveProfile() {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/profile/${userId}`,
        {
          method: "GET",
          headers: {
            "auth-token": cookies["user-id"],
          },
        }
      );
      const respJson = await response.json();
      
      setThemes(respJson["themes"]);
      setPosition(respJson["position"]);
      setLoading(false);
    }
    
    retrieveProfile();
  }, [])

  const saveThemes = async () => {
    fetch(
      `${process.env.REACT_APP_BE_URL}/update-user`,
      {
        method: "POST",
        headers: {
          "auth-token": cookies["user-id"],
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "image_config": newThemes
        })
      }
    )
    setSelectingThemes(false);
  }

  const logOut = () => {
    removeCookie("user-id", { path: '/' });
    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
  }
 
  return (
    <>
      <div className="profileContainer">
        { !loading && (
          <>
            <AppHeader page="profile" userId={userIdViewing} />
            <div className="profileContentContainer">
            { userId == userIdViewing && (
              <>
                { selectingThemes && (
                  <>
                    <ThemeArea themeList={newThemes} setThemeList={setNewThemes} existingThemes={false} />
                    <div className="changeOrSaveButton" onClick={saveThemes}>
                      save
                    </div>
                  </>
                )}
                { !selectingThemes && (
                  <>
                    <ThemeArea themeList={newThemes} setThemeList={setNewThemes} existingThemes={themes} />
                    <div className="changeOrSaveButton" onClick={() => setSelectingThemes(true)}>
                      change themes
                    </div>
                  </>
                )}
                <div className="logOutButton" onClick={logOut}>
                  Log Out
                </div>
              </>
            )}
            </div>

          </>
        )}
      </div>
      { userId && <ImageModal imageSrc={s3_url(userId)} showModal={showModal} setShowModal={setShowModal} /> }
    </>
  )
};

export default Profile;

