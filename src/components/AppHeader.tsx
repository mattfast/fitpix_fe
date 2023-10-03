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

const AppHeader = ({ page, userId, profileName, position }: {
	page: string,
	userId: string,
	profileName?: string,
	position?: number
}) => {
  const navigate = useNavigate();
	const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
	const [regenerations, setRegenerations] = useState<number>(0);

	useEffect(() => {
		async function getLeaderboard() {
			const response = await fetch(
				`${process.env.REACT_APP_BE_URL}/get-user`,
				{
					method: "GET",
					headers: {
						"auth-token": cookies['user-id']
					}
				}
			)

			const respJson = await response.json();
			setRegenerations(respJson["regenerations"])
		}
		
		getLeaderboard();

	}, [])

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
						<div className="leaderboardLink" onClick={() => navigate("/leaderboard")}>🏆</div>
					)}
					<div className="voteHeaderIcon">
						{ page == "vote" && "dopple.club" }
						{ page == "leaderboard" && "leaderboard" }
						{ page == "profile" && profileName }
					</div>
					{ page != "profile" && (
						<img src={s3_url(userId, regenerations)} className="profileLink" onClick={() => navigate(`/profile/${userId}`)}/>
					)}
					{ page == "profile" && (
						<div className="voteHeaderIcon">{ position && position != 0 && `#${position}` }</div>
					)}
			</div>
    </div>
  );
};

export default AppHeader;
