import React, { useState, useRef, useEffect } from "react";

import Image from "./base/Image";
import "./SocialMediaLinks.css";

const SocialMediaLinks = () => {
 
  return (
    <div className="socialMediaContainer">
      <div className="linkWidget" onClick={() => window.open("https://www.tiktok.com/@fitpix_io/", "_blank")}>
        <Image src="social_media/tiktok.png" width="24px" height="24px" />
      </div>
      <div className="linkWidget" onClick={() => window.open("https://www.instagram.com/fitpix_io/", "_blank")}>
        <Image src="social_media/instagram.png" width="24px" height="24px" />
      </div>
      <div className="linkWidget" onClick={() => window.open("https://twitter.com/fitpix_io", "_blank")}>
        <Image src="social_media/twitter.png" width="24px" height="24px" />
      </div>
    </div>
  )
};

export default SocialMediaLinks;
