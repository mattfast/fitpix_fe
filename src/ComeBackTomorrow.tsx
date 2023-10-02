import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import { difference } from "./utils";
import "./Cooldown.css";
import ShareButton from "./components/ShareButton";

const ComeBackTomorrow = () => {

  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    const { hours: hrs, mins, secs } = difference(tomorrow);
    setSeconds(secs);
    setMinutes(mins);
    setHours(hrs);

    setLoading(false);
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
      { !loading && (
        <>
          <div className="cooldownTextContainer">
            <div className="countdownText2">
              Return tomorrow to see your dopple 
            </div>
            <div className="lockText">
                🔒
            </div>
            <div className="unlocksText">
              Unlocks in {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="orText">and</div>
          </div>
          <ShareButton />
        </>
      )}
    </div>
  );
};

export default ComeBackTomorrow;
