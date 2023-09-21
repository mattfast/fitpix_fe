import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Signup.css";
import makeCookie from "./utils";
import Modal from "./Modal";

const variants = {

};

const Signup = () => {
  const [page, setPage] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState<string>("(123) 456-789")
  const navigate = useNavigate();
 
  return (
    <div className="signupContainer">
      <div className="formContainer">
        <div className="formText">
          { page == 0 && "Enter your phone number"}
          { page == 1 && "What's your first name?"}
          { page == 2 && "What's your last name?"}
        </div>
        <input
          type="text"
          id="formInput"
          className="formInput"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
};

export default Signup;
