import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Webcam from 'react-webcam';
import { useSpring, animated } from 'react-spring';

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree/600.css";
import "./Signup.css";
import s3 from "./s3";
import { formatPhoneNumber } from "./utils";

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
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [page, setPage] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState<string>("(123) 456-7890");
  const [text, setText] = useState<string>("");
  const [rawNumber, setRawNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [camOpen, setCamOpen] = useState<boolean>(false);
  const [themeList, setThemeList] = useState<string[]>([]);
  const [show, setShow] = useState(true);
  const webcamRef = useRef<Webcam | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const fadeAnimation = useSpring({
    opacity: show ? 1 : 0,
    config: { tension: 220, friction: 120 }
  });

  const shiftNextButton = () => {
    const el = document.getElementById("nextButton");
    const px1 = window.visualViewport?.height;
    const px2 = window.innerHeight;
    if (el && px1) el.style.bottom = "calc(26px + " + px2 + "px - " + px1 + "px)";
  }

  setInterval(shiftNextButton, 50);

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
      } else if (themeList.length < 3) {
        setThemeList([...themeList, text]);
        targetComponent.style.backgroundColor = "rgba(255, 255, 255, 1.0)";
        targetComponent.style.color = "#0CA0E4";
      }
    }
  }


  const createUser = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/create-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "number": text
        })
      }
    )
    
    if (response.status !== 200) {
      setErrorMessage(`A user already exists with that phone number. If that phone number is yours, please log in here: ${process.env.REACT_APP_BASE_URL}.\n\nIf not, please text us at 281-224-0743.`);
      return false;
    }

    const respJson = await response.json();
    if (respJson["cookie"]) {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 10);
      setCookie("user-id", respJson["cookie"], { expires: futureDate });
    }

    return response.status === 200;
  }

  const updateUser = async (keyVal: any) => {
    if (!cookies["user-id"]) {
      setErrorMessage("cookie not set");
      return false;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/update-user`,
      {
        method: "POST",
        headers: {
          "auth-token": cookies["user-id"],
          "Content-Type": "application/json"
        },
        body: JSON.stringify(keyVal)
      }
    )

    return response.status === 200;
  }

  const clearTextArea = () => {
    const el = document.getElementById("textInput") as HTMLInputElement;
    if (el) el.value = "";
    setText("");
  }

  const onTextInput = async (i: string) => {
    if (i[i.length - 1] == "\n") {
      if (i.length == 1) {
        clearTextArea();
      } else if (page < 3) {
        await nextClick();
      }

      return;
    }
  
    const el = document.getElementById("textInput") as HTMLInputElement;
    if (page == 0) {
      const inputText = i.replace(/\D/g, '').slice(0,10);
      const formattedNumber = formatPhoneNumber(inputText);
      if (el) el.value = formattedNumber;
      setText(inputText);
    } else if (page == 1 || page == 2) {
      if (i.length < 30) {
        setText(i);
      } else {
        if (el) el.value = i.slice(0, 30);
        setText(i.slice(0, 30));
      }
    }
  }

  const validateLength = () => {

    if (text.length == 0) {
      setErrorMessage("Input field cannot be empty.")
      return false;
    }

    if (page == 0 && text.length < 10) {
      setErrorMessage("Number must be in the format (123) 456-7890");
      return false;
    }

    return true;
  }

  const uploadImageToS3 = async () => {
    // Create a new image element and set its source to the captured image.
    // Define the S3 bucket name and file name
    const bucketName = 'dopple-selfies';
    const fileName = `selfie-1-${cookies['user-id']}.jpg`; // Unique file name

    // Encode the image as a buffer
    const imageBlob = await fetch(capturedImage || "").then((response) => response.blob());

    // Set up the parameters for the S3 upload
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: imageBlob,
      ContentType: 'image/jpeg', // Adjust the content type as needed
    };

    // Upload the image to S3
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading image to S3:', err);
      } else {
        console.log('Image uploaded successfully:', data.Location);
        // You can handle success here, such as displaying a success message to the user.
      }
    });
  }

  const enterDetector = (key: string) => {
    if (key.toUpperCase() == "ENTER") nextClick();
  }

  useEffect(() => {
    async function refocusKeyboard() {
      if (textInputRef.current) {
        textInputRef.current.blur();
        await new Promise(r => setTimeout(r, 500));
        textInputRef.current.focus();
      }
    }

    refocusKeyboard();

  }, [page])

  const nextClick = async () => {

    setShow(false);

    // validate input
    if (page < 3) {
      const validated = validateLength();
      if (!validated) {
        setShow(true);
        return;
      }
    }

    if (page == 0) {
      const ok = await createUser();
      if (!ok) {
        setShow(true);
        return;
      }
      setPlaceholder("FIRST NAME");
    } else if (page == 1) {
      const ok = await updateUser({ "first_name": text });
      if (!ok) {
        setErrorMessage("We're having trouble communicating with our servers right now. Try again in a sec!");
        setShow(true);
        return;
      }
      setPlaceholder("LAST NAME");
    } else if (page == 2) {
      const ok = await updateUser({ "last_name": text });
      if (!ok) {
        setErrorMessage("We're having trouble communicating with our servers right now. Try again in a sec!");
        setShow(true);
        return;
      }
    } else if (page == 3) {
      uploadImageToS3();
    } else if (page == 4) {
      navigate("/vote");
      return;
    }

    clearTextArea();
    setText("");
    setErrorMessage("");
    setPage(page + 1);
    setShow(true);
  }
 
  return (
    <div className="overallSignupContainer">
      <div className="signupContainer">
        <animated.div className="formContainer" style={fadeAnimation}>
          <div className="formText">
            { page == 0 && "Enter your phone number"}
            { page == 1 && "What's your first name?"}
            { page == 2 && "What's your last name?"}
            { page == 3 && "Create your dopple"}
            { page == 4 && "Customize your dopple"}
          </div>
          { page < 3 && (
            <input
              type={page == 0 ? "tel" : "text"}
              id="textInput"
              className="textInput"
              ref={textInputRef}
              placeholder={placeholder}
              onKeyUp={(e) => enterDetector(e.key)}
              onChange={(e) => {
                onTextInput(e.currentTarget.value)
              }}
            />
          )}
          { camOpen && (
            <Webcam forceScreenshotSourceSize className="fileInput" screenshotFormat="image/jpeg" audio={false} ref={webcamRef} mirrored={true} />
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
              <div className="themesArea">
                <div className="themesInstructionText">Choose up to 3 personalities:</div>
                <div className="themes">
                  { themes.map(t => (
                    <div id={`emoji-button-${t.text}`} className="retakeButton" onClick={() => addToThemeList(t.text)}>
                      <div>{t.emoji}</div>
                      <div>{t.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          { errorMessage && (
            <div className="errorText">
              {errorMessage}
            </div>
          )}
        </animated.div>
        { (page !== 3 || selectedFile || capturedImage) && (
          <div id="nextButton" className="nextButton" onClick={(e) => {
            //e.preventDefault();
            if (textInputRef.current) {
              //textInputRef.current.blur();
              textInputRef.current.focus();
            }
            nextClick();
          }}>
              <div className="nextButtonText">
                {page < 3 && "Next"}
                {(page > 3 || selectedFile || capturedImage) && "Looks good"}
              </div>
            <img src={process.env.PUBLIC_URL + "assets/right-arrow.png"} className="nextButtonArrow" />
          </div>
        )}
      </div>
    </div>
  )
};

export default Signup;
