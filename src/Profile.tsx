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
  const [primaryImage, setPrimaryImage] = useState<number>(0);
  const [newPrimaryImage, setNewPrimaryImage] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [invalidImages, setInvalidImages] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function validate() {
      const user_id = await validateCookie(cookies['user-id']);
      if (!user_id) {
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
      setPrimaryImage(respJson["primary_image"]);
      setNewPrimaryImage(respJson["primary_image"]);
      setLoading(false);
    }
    
    retrieveProfile();
  }, [])

  useEffect(() => {
    for (let i = 0; i < 15; i++) {
      const el = document.getElementById(`doppleImage${i}`);
      if (el) {
        if (i == newPrimaryImage) {
          el.style.border = "1px solid #FFF";
        } else {
          el.style.border = "none";
        }
      }
    }
  }, [newPrimaryImage])

  useEffect(() => {
    async function checkImages() {
      const newInvalid: number[] = [];
      for (let i = 0; i < 15; i++) {
        const response = await fetch(
          s3_url(userId || "", i)
        );

        console.log(`STATUS FOR ${i}`);
        console.log(response.status);

        if (response.status != 200) {
          console.log("PUSHING");
          newInvalid.push(i);
        }
      }

      console.log(newInvalid);
      setInvalidImages(newInvalid);
    };
    
    checkImages();
  }, [userId])

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

  const setPrimaryImageCallback = async () => {

    fetch(
      `${process.env.REACT_APP_BE_URL}/set-primary-image`,
      {
        method: "POST",
        headers: {
          "auth-token": cookies["user-id"],
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "primary_image": newPrimaryImage
        })
      }
    )

    setPrimaryImage(newPrimaryImage);
  }

  const logOut = () => {
    removeCookie("user-id", { path: '/' });
    window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
  }

  /*
                    <div className="themeSuccessText">{4 - regenerations} / 4 Daily Regenerations Left</div>
  */
 
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
              { userId && <img className="doppleImage" src={s3_url(userId, primaryImage)} onClick={() => setShowModal(true)} /> }
              { userId == userIdViewing && (
                <>
                  <div className="doppleText2">
                    Other Options
                  </div>
                  <div className="doppleImageOptions">
                    { [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].filter(n => !invalidImages.includes(n)).map(n => (
                      n !== primaryImage && <img id={`doppleImage${n}`} className="doppleImageOption" src={s3_url(userId, n)} onClick={() => setNewPrimaryImage(n)} />
                    ))}
                  </div>
                  <div className="changeOrSaveButton" onClick={setPrimaryImageCallback}>Set New Primary Image</div>
                  { errorMessage && (
                    <div className="themeSuccessText">
                      {errorMessage}
                    </div>
                  )}
                  <div className="space" />
                  <div className="doppleText">
                    Your Personalities
                  </div>
                  <ThemeArea themeList={themes} setThemeList={setThemes} isSelecting={selectingThemes} noText={true} />
                  <div className="changeOrSaveButton" onClick={changeOrSave}>
                    { selectingThemes ? "save" : "select new" }
                  </div>
                  { successMessage && (
                    <div className="themeSuccessText">
                      {successMessage}
                    </div>
                  )}
                  { userId == userIdViewing && (
                    <div className="competitionText">Get ready. The competition begins tomorrow. 🏆</div>
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
      { userId && <ImageModal imageSrc={s3_url(userId, primaryImage)} showModal={showModal} setShowModal={setShowModal} /> }
    </>
  )
};

export default Profile;

