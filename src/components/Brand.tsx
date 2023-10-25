import React, { useState, useRef, useEffect } from "react";

import Title from "./base/Title";
import Text from "./base/Text";
import SignupButton from "./SignupButton";
import Spacer from "./base/Spacer";
import Image from "./base/Image";

import "./Brand.css";
import { logClick } from "../utils";

const Brand = ({ brand, setModalOpen }) => {

  const onClick = () => {
    logClick(brand);
    setModalOpen(true);
  }
 
  return (
    <div className="brandContainer">
      <img className="brandModel" src={ process.env.PUBLIC_URL + "assets/" + "brands/" + brand + "/model.jpg"} />
      <div className="brandButton" onClick={onClick}>
        <Image src={"brands/" + brand + "/logo.png"} width="80px" height="auto" />
      </div>
    </div>
  )
};

export default Brand;
