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
  const [userCount, setUserCount] = useState<number>(8);
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

  useEffect(() => {
    async function getUserCount() {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/user-count`,
        {
          method: "GET"
        }
      );
      const respJson = await response.json();
      if (respJson["user_count"] && respJson["user_count"] > 8) {
        setUserCount(respJson["user_count"]);
      }
    }

    getUserCount();
  }, [])

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
            <Title level="primary">Upgrade your online shopping experience</Title>
            <Text size="large" weight="normal" color="black">
              See how clothes will look on you before clicking order.
            </Text>
          </Spacer>
          <SignupButton textGradient={true} onClick={onTopClick} />
          <div style={{ marginTop: "-10px" }}>
            <Text size="tiny" weight="normal" color="black">
              {userCount}+ friends already joined
            </Text>
          </div>
        </Spacer>

        <Instructions />
      </div>
      <Spacer gap={40}><div /><div /></Spacer>
      <Spacer gap={40}>
        <Page 
          labelText="AI MAGIC"
          title="See Yourself In it before buying it"
          secondaryText={<div>Our cutting-edge tech shows exactly how you will look in your new fit.</div>}
          imageSrc="animations/1.gif"
          largeImage={false}
        />
        <Title level="primary">Brands We Offer</Title>
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
          labelText="MORE FUN"
          title="get your friends' takes"
          secondaryText="Share your fits and decide together."
          imageSrc="animations/3.gif"
          largeImage={true}
        />
        <Page 
          labelText="1-CLICK CHECKOUT"
          title="buy your dream look"
          secondaryText="Create your outfits with a single click."
          imageSrc="animations/2.gif"
          largeImage={false}
        />
      </div>
      <BottomPage setModalOpen={setModalOpen} cookie={cookies['user-id']} userCount={userCount} />
      <AppFooter />
      <Analytics />
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} cookie={cookies['user-id']} />
    </>
  )
};

export default LandingPage;
