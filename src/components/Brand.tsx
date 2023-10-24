import React, { useState, useRef, useEffect } from "react";

import Title from "./base/Title";
import Text from "./base/Text";
import SignupButton from "./SignupButton";
import Spacer from "./base/Spacer";
import Image from "./base/Image";

import "./Brand.css";

const Brand = ({ brand }) => {
 
  return (
    <div className="brandContainer">
      <img className="brandModel" src={ process.env.PUBLIC_URL + "assets/" + "brands/" + brand + "/model.png"} />
      <div className="brandButton">
        <Image src={"brands/" + brand + "/logo.png"} width="auto" height="36.8px" />
      </div>
    </div>
  )
};

export default Brand;
