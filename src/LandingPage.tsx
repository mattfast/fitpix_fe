import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";
import { Analytics } from '@vercel/analytics/react';

import "@fontsource/rubik/500.css";
import "@fontsource/figtree/600.css";
import "./LandingPage.css";
import { validateCookie } from "./utils";

import LandingPageImage from "./components/LandingPageImage";
import LoginModal from "./components/LoginModal";
import InfoModal from "./components/InfoModal";

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

  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const loginButtonRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function validate() {
      const user_id = await validateCookie(cookies['user-id']);
      if (user_id) {
        navigate(`/profile/${user_id}`);
      }
    }
    
    validate();
  }, [])

  useEffect(() => {
    const rc = searchParams.get("rc");
    if (rc) {
      setReferralCode(rc);
    }
  }, [searchParams])


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
          //navigate(`/profile/${}`);
          const user_id = await validateCookie(respJson["cookie"]);
          if (user_id) {
            navigate(`/profile/${user_id}`);
          }
        }
      }

    }

    verifySP();
  }, [searchParams])

  /* 
        

        <LandingPageImage />
  <div id="loginButton" className="loginButton" onClick={() => setModalOpen(true)} ref={loginButtonRef}>
                <div className="loginButtonText">
                  Log in
                </div>
              </div>*/
 
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
            </div>
            <div className="subtitle">
              <div className="subtitleRow">See yourself in every <div className="pink">universe. </div><img className="infoButton" src={process.env.PUBLIC_URL + "assets/info.png"} onClick={() => setInfoModalOpen(true)} ref={infoButtonRef} /></div>
            </div>
            <div id="buttonGroup" className="buttonGroup">
              <div
                id="signupButton"
                className="signupButton"
                onClick={
                  () => {
                    console.log("Info button");
                    window.location.replace(`${process.env.REACT_APP_BASE_URL}/signup${referralCode ? `?rc=${referralCode}` : ``}`);
                  }
                }
              >
                <div className="buttonText">
                  Create your Dopple
                </div>
              </div>
              <div
                id="loginButton"
                className="signupButton"
                onClick={
                  () => {
                    console.log("Login button");
                    setLoginModalOpen(true);
                  }
                }
              >
                <div className="buttonText">
                  Log In
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      { loginModalOpen && <LoginModal modalOpen={loginModalOpen} setModalOpen={setLoginModalOpen} buttonRef={loginButtonRef} /> }
      { infoModalOpen && <InfoModal modalOpen={infoModalOpen} setModalOpen={setInfoModalOpen} buttonRef={infoButtonRef}/> }
      <Analytics />
    </>
  )
};

export default LandingPage;
