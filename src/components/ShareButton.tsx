import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "./ShareButton.css";

const ShareButton = ({ buttonText }: {
  buttonText?: string
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [referralCode, setReferralCode] = useState<string>("");

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BE_URL}/get-referral-code`,
      { 
        headers: {
          "auth-token": cookies['user-id'],
        }
      }
    ).then(r => {
      return r.json();
    }).then(d => {
      d["referral_code"] && setReferralCode(d["referral_code"]);
    })
  }, [])
 
  return (
    <div
      className="shareButton"
      onClick={
        () => window.open(
          `sms:?&body=${
            encodeURIComponent(`Create a profile on dopple.club! https://dopple.club/?rc=${referralCode}`)
          }`,
          "_blank"
        )
      }
    >
      <div className="shareButtonText">{ buttonText ? buttonText : "Invite Friends" }</div>
      <img src={process.env.PUBLIC_URL + "assets/right-arrow.png"} className="shareButtonArrow" />
    </div>
  )
};

export default ShareButton;
