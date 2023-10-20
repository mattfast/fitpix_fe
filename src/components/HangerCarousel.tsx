import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "./HangerCarousel.css";

const HangerCarousel = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
 
  return (
    <div className="topPageContainer">

    </div>
  )
};

export default HangerCarousel;
