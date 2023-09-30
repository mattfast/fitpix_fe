import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "./ThemeArea.css";
import "../Signup.css"

const themeNames = [
  "king",
  "princess",
  "cowboy",
  "athlete",
  "magical",
  "warrior"
]

const themeEmojis = [
  "👑",
  "👸🏻",
  "🤠",
  "🏈",
  "🪄",
   "⚔️",
];

const ThemeArea = ({ themeList, setThemeList, existingThemes }) => {

  const addToThemeList = (text: string) => {
    if (existingThemes) return;

    const targetComponent = document.getElementById(`emoji-button-${text}`);
    
    if (targetComponent) {
      if (themeList.includes(text)) {
        setThemeList(themeList.filter(t => t != text));
        targetComponent.style.backgroundColor = "rgba(255, 255, 255, 0.16)";
        targetComponent.style.color = "#FFF";
      } else if (themeList.length < 3) {
        setThemeList([...themeList, text]);
        targetComponent.style.backgroundColor = "rgba(255, 255, 255, 1.0)";
        targetComponent.style.color = "#0CA0E4";
      }
    }
  }
 
  return (
    <div className="themesArea">
      <div className="themesInstructionText">
        { existingThemes && "Choose up to 3 personalities:" }
        { !existingThemes && "Your personalities:" }
      </div>
        <div className="themes">
          { !existingThemes && themeNames.map((t, i) => (
            <div id={`emoji-button-${t}`} className="retakeButton" onClick={() => addToThemeList(t)}>
              <div>{themeEmojis[i]}</div>
              <div>{t}</div>
            </div>
          ))}
          { existingThemes && existingThemes.map(t => (
            <div id={`emoji-button-${t}`} className="retakeButton" onClick={() => addToThemeList(t)}>
              <div>{themeEmojis[themeNames.indexOf(t)]}</div>
              <div>{t}</div>
            </div>
          ))}
      </div>
    </div>
  )
};

export default ThemeArea;
