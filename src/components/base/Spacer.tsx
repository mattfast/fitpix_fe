import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"

const Spacer = ({ gap, children }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: gap + "px",
      alignSelf: "stretch",
    }}>
      {children}
    </div>
  )
};

export default Spacer;
