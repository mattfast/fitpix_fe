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

const Cooldown = ({ initialHrs, initialMins, initialSecs }) => {
  const [hours, setHours] = useState<number>(initialHrs);
  const [minutes, setMinutes] = useState<number>(initialMins);
  const [seconds, setSeconds] = useState<number>(initialSecs);

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
    } else if (hours > 0) {
      setHours(hours - 1);
      setMinutes(59);
      setSeconds(59);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="cooldownContainer">
      <div className="cooldownTextContainer">
        <div className="countdownText2">
          New pics in {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="lockText">
            🔒
        </div>
        <div className="orText">or</div>
      </div>
      <ShareButton buttonText="Invite a Friend"/>
    </div>
  );
};

export default Cooldown;
