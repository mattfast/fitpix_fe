import React, { useState, useRef, useEffect } from "react";

import Image from "./base/Image";
import "./SocialMediaLinks.css";

const SocialMediaLinks = () => {
 
  return (
    <div className="socialMediaContainer">
      <div className="linkWidget" onClick={() => window.open("https://www.tiktok.com/@milk__ai/", "_blank")}>
        <Image src="social_media/tiktok.png" width="24px" height="24px" />
      </div>
      <div className="linkWidget" onClick={() => window.open("https://discord.gg/mgWxBhAk", "_blank")}>
        <Image src="social_media/discord.png" width="24px" height="20px" />
      </div>
      <div className="linkWidget" onClick={() => window.open("https://www.instagram.com/paly_dopple/", "_blank")}>
        <Image src="social_media/instagram.png" width="24px" height="24px" />
      </div>
      <div className="linkWidget" onClick={() => window.open("https://twitter.com/milk_ai__", "_blank")}>
        <Image src="social_media/twitter.png" width="24px" height="24px" />
      </div>
    </div>
  )
};

export default SocialMediaLinks;
