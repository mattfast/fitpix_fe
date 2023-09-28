import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
//import useWebSocket, { ReadyState } from 'react-use-websocket';
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree";
import "@fontsource/figtree/600.css";
import "./LoginModal.css";
import { formatPhoneNumber } from "../utils";
import { String } from "aws-sdk/clients/cloudsearch";

const LoginModal = ({ setModalOpen, modalOpen, buttonRef }) => {
  const [closable, setClosable] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const modal = document.getElementById("modal");
    if (modalOpen) {
      if (modal) modal.style.display = "flex";
    } else {
      if (modal) modal.style.display = "none";
    }
  }, [modalOpen])

  useEffect(() => {
    setModalClose();
  }, [modalOpen])

  const setModalClose = async () => {
    if (modalOpen) {
      await new Promise(r => setTimeout(r, 200));
      setClosable(true);
    } else {
      setClosable(false);
    }
  }

  useEffect(() => {
    const button = document.getElementById("formButton");
    if (button) {
      button.style.opacity = inputText.length == 10 ? "1" : "0.3";
      button.style.cursor = inputText.length == 10 ? "pointer" : "none";
    }
  }, [inputText]);

  const enterDetector = (key: string) => {
    if (key.toUpperCase() == "ENTER") buttonClick();
  }

  const onTyping = (i: String) => {
    const el = document.getElementById("formInput") as HTMLInputElement;
    const strippedText = i.replace(/\D/g, '').slice(0,10);
    const formattedNumber = formatPhoneNumber(strippedText);
    if (el) el.value = formattedNumber;
    setInputText(strippedText);
  }

  const buttonClick = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/generate-auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "number": inputText
        })
      }
    )

    if (response.status === 401) {
      setErrorMessage(`We don't have a number associated with that account. To signup, click here: ${process.env.REACT_APP_BASE_URL}/signup.`);
    } else if (response.status === 500) {
      setErrorMessage("Our website is experiencing a bit of trouble right now. We're working on it!");
    } else if (response.status === 200) {
      setSuccessMessage("We've texted you a link! Click on it and you should be logged in :)");
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
        <div className="form">
          <div className="loginFormText">
            <div className="formTitle">
              Enter your phone number
            </div>
            <div className="formDescription">
              We'll text you a link that automatically logs you in
            </div>
          </div>
          <input type="tel" id="formInput" className="formInput" placeholder="(123) 456-7890" onKeyUp={(e) => enterDetector(e.key)} onChange={e => onTyping(e.currentTarget.value)}/>
          { errorMessage !== null && (
            <div className="errorMessage">{errorMessage}</div>
          )}
          { errorMessage !== null && (
            <div className="successMessage">{successMessage}</div>
          )}
        </div>
        <div id="formButton" className="formButton" onClick={buttonClick}>
          <div className="modalButtonText">
            Get login link
          </div>
        </div>
      </div>
    </div>
  )
};

export default LoginModal;
