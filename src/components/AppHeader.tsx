import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./AppHeader.css"
import { s3_url } from "../utils";

const AppHeader = ({ page, userId, profileName }: {
	page: string,
	userId: string,
	profileName?: string
}) => {
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
					{ page == "profile" && (
						<img className="voteLink" src={process.env.PUBLIC_URL + "assets/chevron-left.png"} onClick={() => navigate("/leaderboard")} />
					)}
					<div className="voteHeaderIcon">
						{ page == "vote" && "dopple.club" }
						{ page == "leaderboard" && "leaderboard" }
						{ page == "profile" && profileName }
					</div>
					<img src={s3_url(userId)} className="profileLink" onClick={() => navigate(`/profile/${userId}`)}/>
			</div>
    </div>
  );
};

export default AppHeader;
