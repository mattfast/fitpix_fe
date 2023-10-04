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
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /*useEffect(() => {
    async function validate() {
      if (await validateCookie(cookies['user-id'])) {
        navigate("/vote");
      }
    }
    
    validate();
  }, [])*/

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
          navigate("/vote");
        }
      }

    }

    verifySP();
  }, [searchParams])

  /*              <div id="loginButton" className="loginButton" onClick={() => setModalOpen(true)} ref={buttonRef}>
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
              <div className="subtitle">
                <div className="pink">Sign up to</div> compete against <div className="pink">your</div> friends
              </div>
            </div>
            <LandingPageImage />
            <div id="buttonGroup" className="buttonGroup">
              <div
                id="signupButton"
                className="signupButton"
                onClick={
                  () => window.location.replace(`${process.env.REACT_APP_BASE_URL}/signup${referralCode ? `?rc=${referralCode}` : ``}`)
                }
              >
                <div className="buttonText">
                  Create your Dopple
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} buttonRef={buttonRef} />
      <Analytics />
    </>
  )
};

export default LandingPage;
