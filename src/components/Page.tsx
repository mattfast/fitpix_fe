import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"

import Label from "./Label";
import Title from "./base/Title";
import Text from "./base/Text";
import Image from "./base/Image";
import Spacer from "./base/Spacer";

import "./Page.css";

const Page = ({ labelText, title, secondaryText, imageSrc }) => {
 
  return (
    <div className="secondaryPageContainer">
      <Spacer gap={16}>
        <Label text={labelText} />
        <Spacer gap={8}>
          <Title level="secondary">{title}</Title>
          <Text size="small" weight="normal" color="black">{secondaryText}</Text>
        </Spacer>
        <Image src={imageSrc}  width="240px" height="484px"/>
      </Spacer>
    </div>
  )
};

export default Page;
