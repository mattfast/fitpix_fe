import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik/500.css";
import "@fontsource/figtree/600.css";
import "./LandingPage.css";

import LandingPageImage from "./components/LandingPageImage";
import makeCookie from "./utils";
import Modal from "./Modal";

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
  const navigate = useNavigate();


  useEffect(() => {
    if (cookies['user-id']) {
      navigate("/vote");
    }
  }, [cookies])

  /* () => window.location.replace(`${process.env.REACT_APP_BASE_URL}/signup`) */

  // Add a touchstart event listener to remove the class on touch devices
  /*const component = document.getElementById('signupButton');
  component?.addEventListener('touchstart', function() {
    // Remove the class that overrides hover styles
    component.classList.add('clicked');
  });

  component?.addEventListener('touchend', function() {
    // Remove the class that overrides hover styles
    component.classList.remove('clicked');
  });*/
 
  return (
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
        <div id="signupButton" className="button">
          <div className="buttonText">
            Sign up
          </div>
        </div>
      </div>
    </div>
  )
};

export default LandingPage;
