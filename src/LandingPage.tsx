import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
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

const LandingPage = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
 
  return (
    <>
      <AppHeader />
      <div className="topPageContainer">
        <Spacer gap={24}>
          <Spacer gap={16}>
            <Title level="primary">find your new fit</Title>
            <Text size="large" weight="normal" color="black">
              See how you look in designer styles without leaving home.
            </Text>
          </Spacer>
          <SignupButton textGradient={true} onClick={() => setModalOpen(true)} />
        </Spacer>
      </div>
      <div className="brandsContainer">
        <Brand brand="depop" />
        <Brand brand="pacsun" />
        <Brand brand="urban" />
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
      <BottomPage />
      <AppFooter />
      <Analytics />
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  )
};

export default LandingPage;
