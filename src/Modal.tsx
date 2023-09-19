import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
//import useWebSocket, { ReadyState } from 'react-use-websocket';
import { io } from "socket.io-client";
import validator from "validator";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree";
import "@fontsource/figtree/600.css";
import "./Modal.css";

const Modal = ({ open, sid, socket, cookie, setModalOpen, isLandingPage, startPage, buttonRef }) => {
  const [page, setPage] = useState<number>(startPage);
  const [closable, setClosable] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [modalButtonText, setModalButtonText] = useState<string>(isLandingPage ? "Start talking" : "Get early access");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const modal = document.getElementById("modal");
    if (open) {
      if (modal) modal.style.display = "flex";
    } else {
      if (modal) modal.style.display = "none";
    }
  }, [open])

  useEffect(() => {
    if (!open) setPage(startPage);
  }, [startPage])

  useEffect(() => {
    setModalClose();
  }, [open])

  const setModalClose = async () => {
    if (open) {
      await new Promise(r => setTimeout(r, 200));
      setClosable(true);
    } else {
      setClosable(false);
    }
  }

  useEffect(() => {
    if (page == 0) {
      const button = document.getElementById("formButton")
      if (button) {
        button.style.opacity = inputText.length > 0 ? "1" : "0.3";
      }
    } else if (page == 1) {
      setModalButtonText(inputText.length > 0 ? "Save" : "Skip");
    }

    if (inputText.length == 0) setErrorMessage(null);
  }, [inputText, page]);

  const enterDetector = (key: string) => {
    if (key.toUpperCase() == "ENTER") buttonClick();
  }

  const buttonClick = () => {
    if (page == 0) {
      if (inputText.length < 1) return;

      // validate email
      if (!validator.isEmail(inputText)) {
        setErrorMessage("Please enter a valid email.");
        return;
      }

      // switch page to 1
      setErrorMessage(null);
      const el = document.getElementById("formInput") as HTMLInputElement;
      if (el) el.value = "";

      // save email
      socket.emit("email", { "email": inputText, "cookie": cookie, "sid": sid });

      // clear inputText
      setInputText("");

      // redirect to chat or go to next page
      isLandingPage ? window.location.replace(process.env.REACT_APP_BASE_URL + "/chat") : setPage(1);
    } else if (page == 1) {

      // validate number
      if (inputText.length > 0 && !validator.isMobilePhone(inputText)) {
        setErrorMessage("Please enter a valid number or press skip.");
        return;
      }

      // switch page to 2
      setErrorMessage(null);
      setPage(2);
      setClosable(true);

      // save phone # (if applicable)
      // TODO: validate phone number
      if (inputText.length > 0) socket.emit("phone", { "phone": inputText, "cookie": cookie, "sid": sid });
    }
  }

  window.addEventListener('click', function(e) {
    if (containerRef !== null && buttonRef !== null) {
      let containsElement = e.composedPath().includes(containerRef.current as EventTarget);
      let containsButton = e.composedPath().includes(buttonRef.current as EventTarget);
      if (!containsElement && !containsButton && closable) {
        setModalOpen(false);
        setClosable(false);
      }
    }
  });
 
  return (
    <div id="modal" className="modal">
      <div ref={containerRef} className="modalContent">
        <div className="comingSoon">
          <div className="comingSoonText">Coming Soon</div>
        </div>
        <div className="form">
          <div className="formText">
            <div className="formTitle">
              { page == 0 && "Milk is almost ready 🙃" }
              { page > 0 && "You’re on the list 🎉" }
            </div>
            <div className="formDescription">
              { page == 0 && 
                (isLandingPage ? "Sign up to start talking!" : "Just enter your email and keep talking" ) }
              { page == 1 && "Add your phone number to get text reminders as well." }
              { page == 2 && "Milk AI is coming soon. In the meantime, join our community:" }
            </div>
          </div>
          { page < 2 && (
            <input type="text" id="formInput" className="formInput" placeholder={ page == 0 ? "Your email" : "Your number" } onKeyUp={(e) => enterDetector(e.key)} onChange={e => setInputText(e.currentTarget.value)}/>
          )}
          { errorMessage !== null && (
            <div className="errorMessage">{errorMessage}</div>
          )}
        </div>
        { page < 2 && (
          <div id="formButton" className="formButton" onClick={buttonClick}>
            <div className="modalButtonText">
              {modalButtonText}
            </div>
          </div>
        )}
        { page == 2 && (
          <div className="socialButtons">
            <div className="socialButton" onClick={() => window.open("sms:?&body=check%20this%20out%3A%0D%0Ahttps%3A%2F%2Fmilk-ai.com", "_blank")}>
              <img className="socialIcon" src={process.env.PUBLIC_URL + "assets/share.png"} />
              <div className="socialText">Share with friends</div>
              <img className="socialIcon" src={process.env.PUBLIC_URL + "assets/arrow-right.png"} />
            </div>
            <div className="socialButton" onClick={() => window.open("https://www.instagram.com/lhs_milkai", "_blank")}>
              <img className="socialIcon" src={process.env.PUBLIC_URL + "assets/instagram.png"} />
              <div className="socialText">Share Insta story</div>
              <img className="socialIcon" src={process.env.PUBLIC_URL + "assets/arrow-right.png"} />
            </div>
            <div className="socialButton" onClick={() => window.open("https://discord.gg/HynXFv9Cu4", "_blank")}>
              <img className="socialIcon" src={process.env.PUBLIC_URL + "assets/discord.png"} />
              <div className="socialText">Join Discord</div>
              <img className="socialIcon" src={process.env.PUBLIC_URL + "assets/arrow-right.png"} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
};

export default Modal;
