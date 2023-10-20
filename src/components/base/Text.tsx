import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion"

import "@fontsource/inter/400.css"; // Specify weight
import "@fontsource/inter/500.css"; // Specify weight
import "@fontsource/inter/600.css"; // Specify weight


const Text = ({ size, weight, color, children }: {
  size: "large" | "small" | "tiny",
  weight: "extraStrong" | "strong" | "normal",
  color: "gradient" | "black" | "white" | "gray",
  children: ReactNode
}) => {
 
  return (
    <div style={{
      textAlign: "center",
      fontFamily: "Inter",
      fontSize: size == "large" ? "18px" : (size == "small" ? "16px" : "12px"),
      fontStyle: "normal",
      fontWeight: weight == "extraStrong" ? "600" : weight == "strong" ? "500" : "400",
      lineHeight: "130%", /* 23.4px */
      letterSpacing: "-0.09px",
      color: color == "black" ? "#2A2826" : color == "white" ? "#F4F2EE" : color == "gray" ? "rgba(255, 255, 255, 0.64)" : color == "gradient" ? "transparent" : undefined,
      background: color == "gradient" ? "linear-gradient(82deg, #FF7B7B 10.01%, #FF7995 49.94%, #FF72B5 83.02%)" : undefined,
      backgroundClip: color == "gradient" ? "text" : undefined,
      WebkitBackgroundClip: color == "gradient" ? "text" : undefined,
    }}>
      {children}
    </div>
  )
};

export default Text;
