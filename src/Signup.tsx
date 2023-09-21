import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";
import Webcam from 'react-webcam';


import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Signup.css";
import makeCookie from "./utils";
import Modal from "./Modal";

const themes = [
  {
    "emoji": "👑",
    "text": "king"
  },
  {
    "emoji": "🤠",
    "text": "cowboy"
  },
  {
    "emoji": "🏈",
    "text": "jock"
  },
  {
    "emoji": "🪄",
    "text": "wizard"
  },
  {
    "emoji": "🤓",
    "text": "nerd"
  },
  {
    "emoji": "🦄",
    "text": "unicorn"
  },
  {
    "emoji": "👸🏻",
    "text": "princess"
  },
  {
    "emoji": "🤑",
    "text": "baller"
  },
];

const Signup = () => {
  const [page, setPage] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState<string>("(123) 456-789");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [camOpen, setCamOpen] = useState<boolean>(false);
  const [themeList, setThemeList] = useState<string[]>([]);
  const webcamRef = useRef<Webcam | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  
  const beginStream = async () => {
    setStreaming(true);
    setCamOpen(true);
    setCapturedImage(null);
    const targetComponent = document.getElementById("streamingComponent");

    await new Promise(r => setTimeout(r, 100));

    if (webcamRef.current && targetComponent) {
      targetComponent.style.width = "255px";
      targetComponent.style.height = "255px";
      targetComponent.style.marginTop = "0px";

      const webcamVideo = webcamRef.current.video as HTMLVideoElement;
      webcamVideo.style.width = "255px";
      webcamVideo.style.height = "255px";
      webcamVideo.style.borderRadius = "2550px";
      webcamVideo.style.display = "flex";
      webcamVideo.style.objectFit = "cover";
      webcamVideo.id = "webcamVideo";
      console.log(webcamVideo);
      targetComponent.appendChild(webcamVideo);
    }
  }

  const capture = async () => {
    const targetComponent = document.getElementById("streamingComponent");
    const videoComponent = document.getElementById("webcamVideo");

    if (webcamRef.current && targetComponent && videoComponent) {
      const imageSrc = webcamRef.current.getScreenshot();
      await new Promise(r => setTimeout(r, 200));
      setCapturedImage(imageSrc);
      console.log(imageSrc);
      setStreaming(false);
      targetComponent.style.width = "1px";
      targetComponent.style.height = "1px";
      targetComponent.style.marginTop = "-41px";
      videoComponent.style.width = "1px";
      videoComponent.style.height = "1px";
    }
  };

  const addToThemeList = (text: string) => {
    const targetComponent = document.getElementById(`emoji-button-${text}`);
    console.log("HERE");
    console.log(targetComponent);
    
    if (targetComponent) {
      if (themeList.includes(text)) {
        setThemeList(themeList.filter(t => t != text));
        targetComponent.style.backgroundColor = "rgba(255, 255, 255, 0.16)";
        targetComponent.style.color = "#FFF";
      } else if (themeList.length < 5) {
        setThemeList([...themeList, text]);
        targetComponent.style.backgroundColor = "rgba(255, 255, 255, 1.0)";
        targetComponent.style.color = "#0CA0E4";
      }
    }
  }

  const nextPage = async () => {
    page == 0 && setPlaceholder("FIRST NAME");
    page == 1 && setPlaceholder("LAST NAME");
    setPage(page + 1);
  }
 
  return (
    <div className="signupContainer">
      <div className="formContainer">
        <div className="formText">
          { page == 0 && "Enter your phone number"}
          { page == 1 && "What's your first name?"}
          { page == 2 && "What's your last name?"}
          { page == 3 && "Create your dopple"}
          { page == 4 && "Customize your dopple"}
        </div>
        { page < 3 && (
          <input
            type="text"
            className="textInput"
            placeholder={placeholder}
          />
        )}
        { camOpen && (
          <Webcam forceScreenshotSourceSize className="fileInput" audio={false} ref={webcamRef} mirrored={true} />
        )}
        <div id="streamingComponent" className="videoFullCircle" />
        { page == 3 && (
          <>
            {selectedFile && (
              <>
                <img src={URL.createObjectURL(selectedFile)} className="photoFullCircle" alt="Selected" />
                <div className="retakeButton" onClick={() => setSelectedFile(null)}>
                  <div>📸</div>
                  <div>Retake</div>
                </div>
              </>
            )}
            {capturedImage && (
              <>
                <img src={capturedImage} alt="Captured" className="photoFullCircle" />
                <div className="retakeButton" onClick={() => setCapturedImage(null)}>
                  <div>📸</div>
                  <div>Retake</div>
                </div>
              </>
            )}
            {streaming && (
              <>
                <div className="retakeButton" onClick={capture}>
                  <div>📸</div>
                  <div>Capture</div>
                </div>
              </>
            )}
            {(!selectedFile && !capturedImage && !streaming) && (
              <>
                <div className="photoEmptyCircle">
                  <img src={process.env.PUBLIC_URL + "assets/user.png"} className="photoPlaceholder" />
                </div>
                <div className="photoButtonGroup">
                  <input type="file" ref={fileInputRef} className="fileInput" accept="image/*" onChange={handleFileChange} />
                  <div className="photoButton" onClick={beginStream}>
                    <div className="nextButtonText">🔥 take  a selfie 🔥</div>
                  </div>
                  <div className="photoButton" onClick={handleFileButtonClick}>
                    <div className="nextButtonText">✨ upload a photo ✨</div>
                  </div>
                </div>
              </>
            )}

          </>
        )}
        { page == 4 && (
          <>
            {selectedFile && (
              <img src={URL.createObjectURL(selectedFile)} className="photoFullCircle" alt="Selected" />
            )}
            {capturedImage && (
              <img src={capturedImage} alt="Captured" className="photoFullCircle" />
            )}
            <div className="themes">
              { themes.map(t => (
                <div id={`emoji-button-${t.text}`} className="retakeButton" onClick={() => addToThemeList(t.text)}>
                  <div>{t.emoji}</div>
                  <div>{t.text}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      { (page !== 3 || selectedFile || capturedImage) && (
        <div className="nextButton" onClick={nextPage}>
            <div className="nextButtonText">
              {page < 3 && "Next"}
              {(page > 3 || selectedFile || capturedImage) && "Looks good"}
            </div>
          <img src={process.env.PUBLIC_URL + "assets/right-arrow.png"} className="nextButtonArrow" />
        </div>
      )}
    </div>
  )
};

export default Signup;
