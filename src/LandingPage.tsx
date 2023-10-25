import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useCookies } from 'react-cookie';
import { Analytics } from '@vercel/analytics/react';

import Title from "./components/base/Title";
import Text from "./components/base/Text";
import SignupButton from "./components/SignupButton";
import Page from "./components/Page";
import BottomPage from "./components/BottomPage";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import Spacer from "./components/base/Spacer";
import Modal from "./components/Modal";
import Brand from "./components/Brand";

import "@fontsource/rubik/500.css";
import "@fontsource/figtree/600.css";
import "./LandingPage.css";
import { logClick } from "./utils";
import Instructions from "./components/Instructions";

const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);

  useEffect(() => {
    async function getOrSetCookie() {
      const cookie = cookies['user-id'];
      if (!cookie) {
        const response = await fetch(
          `${process.env.REACT_APP_BE_URL}/create-fitpix-user`,
          {
            method: "POST",
            headers: {
              "auth-token": cookie,
              "Content-Type": "application/json"
            },
          }
        );

        const respJson = await response.json();
        setCookie("user-id", respJson["cookie"]);
      }
    }
    
    getOrSetCookie();
  }, [cookies])

  const onTopClick = () => {
    logClick("top", cookies["user-id"]);
    setModalOpen(true);
  }
 
  return (
    <>
      <AppHeader setModalOpen={setModalOpen} cookie={cookies['user-id']} />
      <div className="topPageContainer">
        <Spacer gap={24}>
          <Spacer gap={16}>
            <Title level="primary">Shop Confidently</Title>
            <Text size="large" weight="normal" color="black">
              See how you look in thrift and designer styles from home
            </Text>
          </Spacer>
          <SignupButton textGradient={true} onClick={onTopClick} />
        </Spacer>
        <Instructions />
      </div>
      <Spacer gap={40}>
        <Page 
          labelText="AI MAGIC"
          title="become the model"
          secondaryText="Generate photos of yourself in every outfit you wanna buy."
          imageSrc="animations/1.gif"
        />
        <Title level="primary">Partner Brands</Title>
        <div className="brandsContainer">
          <Brand brand="depop" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
          <Brand brand="urban" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
          <Brand brand="nike" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
          <Brand brand="pacsun" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
          <Brand brand="vans" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
          <Brand brand="lululemon" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
        </div>
      </Spacer>
      <div className="secondaryPagesContainer">
        <Page 
          labelText="1-CLICK CHECKOUT"
          title="cure your shopping indecision"
          secondaryText="Decide on outfits with a single click."
          imageSrc="animations/2.gif"
        />
        <Page 
          labelText="MORE FUN"
          title="get your friends' takes"
          secondaryText="Share your fits and decide together."
          imageSrc="Silver.png"
        />
      </div>
      <BottomPage setModalOpen={setModalOpen} cookie={cookies['user-id']} />
      <AppFooter />
      <Analytics />
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} cookie={cookies['user-id']} />
    </>
  )
};

export default LandingPage;
