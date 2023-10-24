import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

import Text from "./base/Text";
import Image from "./base/Image";
import SocialMediaLinks from "./SocialMediaLinks";

import "./AppFooter.css";

const AppFooter = () => {
 
  return (
    <div className="appFooter">
      <div className="appFooterText">
        <Image src="logo-with-text-white.png" width="118px" height="32px" />
        <Text size="small" weight="normal" color="white">Find your new fit.</Text>
      </div>
      <SocialMediaLinks />
    </div>
  )
};

export default AppFooter;
