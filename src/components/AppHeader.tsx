import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

import Image from "./base/Image";

import "./AppHeader.css";

const AppHeader = () => {
 
  return (
    <div className="header">
      <Image src="logo-with-text.png" width="118px" height="32px" />
    </div>
  )
};

export default AppHeader;
