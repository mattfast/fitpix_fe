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
      <div className="brandsContainer">
        <Brand brand="depop" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
        <Brand brand="urban" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
        <Brand brand="nike" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
        <Brand brand="pacsun" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
        <Brand brand="vans" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
        <Brand brand="lululemon" setModalOpen={setModalOpen} cookie={cookies['user-id']} />
      </div>
      <div className="secondaryPagesContainer">
        <Page 
          labelText="AI MAGIC"
          title="shop like you’re the model"
          secondaryText="Generate photos of yourself wearing different outfits without moving a muscle."
          imageSrc="Silver.png"
        />
        <Page 
          labelText="MORE FUN"
          title="shop with friends"
          secondaryText="Vote on your friends’ best fits and see which of your fits your friends like the best."
          imageSrc="Silver.png"
        />
        <Page 
          labelText="1-CLICK CHECKOUT"
          title="shopping with ease"
          secondaryText="Purchase your favorite fits with the click of a button, and get them delivered to your door."
          imageSrc="Silver.png"
        />
      </div>
      <BottomPage setModalOpen={setModalOpen} cookie={cookies['user-id']} />
      <AppFooter />
      <Analytics />
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  )
};

export default LandingPage;
