import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./AppHeader.css"

const AppHeader = ({ page }) => {
  const navigate = useNavigate();

  return (
    <div className="voteHeader">
			<div className="voteHeaderItems">
					{ page == "vote" && (
						<div className="leaderboardLink" onClick={() => navigate("/leaderboard")}>🏆</div>
					)}
					{ page == "leaderboard" && (
						<img className="voteLink" src={process.env.PUBLIC_URL + "assets/cards-blank.png"} onClick={() => navigate("/vote")} />
					)}
					<div className="voteHeaderIcon">{ page == "vote" ? "dopple.club" : "leaderboard" }</div>
					<img src={process.env.PUBLIC_URL + "assets/2.png"} className="profileLink" />
			</div>
    </div>
  );
};

export default AppHeader;
