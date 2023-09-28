import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Cooldown.css";
import ShareButton from "./components/ShareButton";

function difference(date: Date) {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  
  const diffInSecs = Math.floor(diffInMs / 1000);
  const mins = Math.floor(diffInSecs / 60);
  const secs = diffInSecs % 60;

  return { mins, secs }
}

const Cooldown = ({ cooldownTime }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const { mins, secs } = difference(cooldownTime);
    setMinutes(mins);
    setSeconds(secs);
  }, [])

  useEffect(() => {
    // Set the interval to update every second
    const intervalId = setInterval(tick, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [minutes, seconds]);

  const tick = () => {
    if (seconds > 0) {
      // Decrement seconds
      setSeconds(seconds - 1);
    } else if (minutes > 0) {
      // Decrement minutes and reset seconds to 59
      setMinutes(minutes - 1);
      setSeconds(59);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="cooldownContainer">
      <div className="cooldownTextContainer">
        <div className="countdownText">
          new pics in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="orText">or</div>
      </div>
      <ShareButton />
    </div>
  );
};

export default Cooldown;
