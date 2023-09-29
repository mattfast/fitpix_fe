import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "./GenderButton.css";

const GenderButton = ({ gender, setGender }) => {
  
  const clickGender = () => {
    setGender(gender);
    const el = document.getElementById(`genderButton${gender}`);
    if (el) el.style.background = "#FFF";
  }
 
  return (
    <div className="genderButtonContainer">
      <div id={`genderButton${gender}`} className="genderButton" onClick={clickGender}>
        { gender == "Boy" && "👦🏻" }
        { gender == "Girl" && "👧🏻" }
        { gender == "Non-binary/Other" && "🧒🏻" }
      </div>
      <div className="genderText">{gender}</div>
    </div>
  )
};

export default GenderButton;
