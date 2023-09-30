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
  //const [newThemes, setNewThemes] = useState<string[]>([]);
  const [selectingThemes, setSelectingThemes] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
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
      setFirstName(respJson["first_name"]);
      setLastName(respJson["last_name"]);
      setLoading(false);
    }
    
    retrieveProfile();
  }, [])

  const changeOrSave = () => {
    if (selectingThemes) {
      saveThemes();
      setSuccessMessage("Your changes will reflect in your dopple tomorrow :)");
    }
    setSelectingThemes(!selectingThemes);
  }

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
          "image_config": themes
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
            <AppHeader page="profile" userId={userIdViewing} profileName={`${firstName} ${lastName}`} position={position} />
            <div className="profileContentContainer">
              <div className="doppleText">
                { userId == userIdViewing && "Your Dopple" }
                { userId != userIdViewing && `${firstName}'s Dopple` }
              </div>
              { userId && <img className="doppleImage" src={s3_url(userId)} onClick={() => setShowModal(true)} /> }
              { userId == userIdViewing && (
                <>
                  <ThemeArea themeList={themes} setThemeList={setThemes} isSelecting={selectingThemes} />
                  <div className="changeOrSaveButton" onClick={changeOrSave}>
                    { selectingThemes ? "save" : "select new" }
                  </div>
                  { successMessage && (
                    <div className="themeSuccessText">
                      {successMessage}
                    </div>
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

