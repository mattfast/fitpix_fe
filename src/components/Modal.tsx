import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree";
import "@fontsource/figtree/600.css";
import "./Modal.css";
import { formatPhoneNumber } from "../utils";
import { String } from "aws-sdk/clients/cloudsearch";

const LoginModal = ({ setModalOpen, modalOpen, cookie }) => {
  const [page, setPage] = useState<number>(0);
  const [inputText, setInputText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    if (page == 0) {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/add-to-waitlist`,
        {
          method: "POST",
          headers: {
            "auth-token": cookie,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "number": inputText
          })
        }
      )
      if (response.status != 200) {
        setErrorMessage("Our website is experiencing a bit of trouble right now. Try again in a minute!");
      } else if (response.status == 200) {
        setPage(1);
      }
    } else {
      await fetch(
        `${process.env.REACT_APP_BE_URL}/opened-typeform`,
        {
          method: "POST",
          headers: {
            "auth-token": cookie,
            "Content-Type": "application/json"
          },
        }
      )
      window.open("https://6zjeyd89s7o.typeform.com/to/CbU29n4i", "_blank");
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current !== null) {
        let containsElement = e.composedPath().includes(containerRef.current as EventTarget);
        if (!containsElement) {
            setModalOpen(false);
            // setClosable(false);
        }
      }
    }

    let timer;
    if (modalOpen) {
      timer = setTimeout(() => {
          window.addEventListener('click', handleClickOutside);
      }, 10);
    }
    return () => {
      clearTimeout(timer); // Ensure to clear the timeout if component unmounts before timeout completes.
      window.removeEventListener('click', handleClickOutside);
    };
}, [modalOpen]);
 
  return (
    <div id="modal" className="modal">
      <div ref={containerRef} className="modalContent">
        <div className="form">
          <div className="loginFormText">
            <div className="formTitle">
              { page == 0 && "Fitpix is almost ready." }
              { page == 1 && "You're on the waitlist!" }
            </div>
            <div className="formDescription">
              { page == 0 && "Sign up for our waitlist by entering your number below" }
              { page == 1 && "If you wanna get extra-early access, fill out some extra information about why you're interested in our product:" }
            </div>
          </div>
          { page == 0 && <input type="tel" id="formInput" className="formInput" placeholder="(123) 456-7890" onKeyUp={(e) => enterDetector(e.key)} onChange={e => onTyping(e.currentTarget.value)}/> }
          { errorMessage !== null && (
            <div className="errorMessage">{errorMessage}</div>
          )}
        </div>
        <div id="formButton" className="formButton" onClick={buttonClick}>
          <div className="modalButtonText">
            { page == 0 && "Join the Waitlist" }
            { page == 1 && "Get Early Access" }
          </div>
        </div>
      </div>
    </div>
  )
};

export default LoginModal;
