import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';

import "./PaymentPage.css";

const PaymentPage = ({ paymentOption, setPaymentOption }) => {

  useEffect(() => {
    const el1 = document.getElementById("paymentOption");
    const el2 = document.getElementById("referralOption");

    if (paymentOption == "payment") {
      if (el1) el1.style.border = "2px solid #ACFC85";
      if (el2) el2.style.border = "none";
    } else {
      if (el1) el1.style.border = "none";
      if (el2) el2.style.border = "2px solid #ACFC85";
    }
  }, [paymentOption])
  
 
  return (
    <div className="paymentButtonGroup">
      <div id="referralOption" className="paymentOption" onClick={() => setPaymentOption("referral")}>
        <div className="paymentTextRow">
          <div className="paymentPrimaryText">
            Refer 2 friends
          </div>
          <img src={process.env.PUBLIC_URL + "assets/share2.png"} className="shareArrow" />
        </div>
        <div className="paymentTextRow">
          <div className="paymentSecondaryText">
            0/2 friends
          </div>
        </div>
      </div>
      <div id="paymentOption" className="paymentOption" onClick={() => setPaymentOption("payment")}>
        <div className="popularSign">POPULAR</div>
        <div className="saleSign">75% OFF</div>
        <div className="paymentTextRow">
          <div className="paymentPrimaryText">
            Express
          </div>
          <div className="paymentPrimaryText">
            $0.99
          </div>
        </div>
        <div className="paymentTextRow">
          <div className="paymentSecondaryText">
            Within 1 hour
          </div>
          <div className="paymentSecondaryText">
            <div className="strikethrough">
              $3.99
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default PaymentPage;
