import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik/500.css";
import "@fontsource/figtree/600.css";
import "./LandingPage.css";

import LandingPageImage from "./components/LandingPageImage";
import LoginModal from "./components/LoginModal";

const variants = {

};


/*

TODO:
- Add login button
- enable sign up button
- add fade out transition 
- Fit to different screen sizes
- Check for valid cookie + redirect to voting if present
- add circle crop to central image
- fix touch bug with signup button
*/

const LandingPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const shiftButtons = () => {
    const el = document.getElementById("buttonGroup");
    const px1 = window.visualViewport?.height;
    const px2 = window.innerHeight;
    if (el && px1) el.style.bottom = "calc(26px + " + px2 + "px - " + px1 + "px)";
  }

  useEffect(() => {
    async function verifySP() {
      const param = searchParams.get('q');
      if (param) {
        const response = await fetch(
          `${process.env.REACT_APP_BE_URL}/verify-auth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "search_param": param
            })
          }
        )

        if (response.status !== 200) {
          // TODO: create error modal
          console.log("Sorry, search query invalid");
          console.log(response.status);
        }

        const respJson = await response.json();

        if (respJson['cookie']) {
          console.log("setting cookie");
          console.log(respJson['cookie']);
          const futureDate = new Date();
          futureDate.setFullYear(futureDate.getFullYear() + 10);
          setCookie("user-id", respJson["cookie"], { expires: futureDate });
        }
      }

    }

    verifySP();
  }, [searchParams])

  useEffect(() => {
    if (cookies['user-id']) {
      navigate("/vote");
    }
  }, [cookies])
 
  return (
    <>
      <div className="overallContainer">
        <div className="container">
          <div className="contentContainer">
            <div className="textContainer">
              <div className="titleContainer">
                <div className="crown">👑</div>
                <div className="name">dopple.club</div>
              </div>
              <div className="subtitle">
                <div className="pink">Find</div> the 🤴 and 👸🏻 of <div className="pink">your class</div>
              </div>
            </div>
            <LandingPageImage />
            <div id="buttonGroup" className="buttonGroup">
              <div id="signupButton" className="signupButton" onClick={() => window.location.replace(`${process.env.REACT_APP_BASE_URL}/signup`)}>
                <div className="buttonText">
                  Sign up
                </div>
              </div>
              <div id="loginButton" className="loginButton" onClick={() => setModalOpen(true)} ref={buttonRef}>
                <div className="loginButtonText">
                  Log in
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} buttonRef={buttonRef} />
    </>
  )
};

export default LandingPage;
