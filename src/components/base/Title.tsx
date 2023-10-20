import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion"

const Title = ({ level, children }: {
  level: "primary" | "secondary",
  children: ReactNode
}) => {
 
  return (
    <div style={{
      color: "#2A2826",
      textAlign: "center",
      fontFamily: "GrtskTera",
      fontStyle: "normal",
      fontSize: level == "primary" ? "32px" : "24px",
      fontWeight: 700,
      lineHeight: "normal",
      letterSpacing: "-0.64px",
      textTransform: "uppercase"
    }}>
      {children}
    </div>
  )
};

export default Title;
