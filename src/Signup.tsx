import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion"
import { useNavigate, useSearchParams } from "react-router-dom";
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
import ComeBackTomorrow from "./ComeBackTomorrow";
import GenderButton from "./components/GenderButton";
import ThemeArea from "./components/ThemeArea";
import InfoModal from "./components/InfoModal";

const Signup = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState<number>(0);
  const [placeholder, setPlaceholder] = useState<string>("(123) 456-7890");
  const [userId, setUserId] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [shouldFocus, setShouldFocus] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [streaming, setStreaming] = useState<boolean>(false);
  const [camOpen, setCamOpen] = useState<boolean>(false);
  const [themeList, setThemeList] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(true);
  const [showNumber, setShowNumber] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [currentNumber, setCurrentNumber] = useState<number>(4);
  const [currentInstructions, setCurrentInstructions] = useState<string>("");
  const [selfieAnimationHappening, setSelfieAnimationHappening] = useState<boolean>(false);
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);

  const [capturedImage1, setCapturedImage1] = useState<string | null>(null);
  const [capturedImage2, setCapturedImage2] = useState<string | null>(null);
  const [capturedImage3, setCapturedImage3] = useState<string | null>(null);
  const [capturedImage4, setCapturedImage4] = useState<string | null>(null);
  const [capturedImage5, setCapturedImage5] = useState<string | null>(null);

  const webcamRef = useRef<Webcam | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const infoButtonRef = useRef<HTMLImageElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // fetch user, go to first uncompleted page
    async function getUserProgress() {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/get-user`,
        {
          method: "GET",
          headers: {
            "auth-token": cookies["user-id"],
          },
        }
      );
      const respJson = await response.json();
      console.log("USER FETCHED");
      console.log(respJson);
      // set user_id
      if (respJson["user_id"]) setUserId(respJson["user_id"]);

      // set
      if (respJson["gender"]) setPage(6);
      else if (respJson["last_name"]) setPage(5);
      else if (respJson["first_name"]) setPage(4);
      else if (respJson["images_uploaded"]) setPage(3);
      else if (respJson["number"]) setPage(1);
    }

    getUserProgress();
  }, [])

  const fadeAnimation = useSpring({
    opacity: show ? 1 : 0,
    config: { tension: 220, friction: 120 }
  });

  const fadeAnimationQuick = useSpring({
    opacity: showNumber ? 1 : 0,
    config: { tension: 320, friction: 40 }
  });

  const shiftNextButton = () => {
    const el = document.getElementById("nextButton");
    const px1 = window.visualViewport?.height;
    const px2 = window.innerHeight;
    if (el && px1) el.style.bottom = "calc(26px + " + px2 + "px - " + px1 + "px)";
  }

  useEffect(() => {
    const intervalId = setInterval(shiftNextButton, 50);
    return () => clearInterval(intervalId);
  }, []);

  
  const beginStream = async () => {
    console.log("HERE");
    setStreaming(true);
    setCamOpen(true);
    setCapturedImage1(null);
    setCapturedImage2(null);
    setCapturedImage3(null);
    setCapturedImage4(null);
    setCapturedImage5(null);
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
      //targetComponent.appendChild(webcamVideo);
    }

  }

  const numberAnimation = async () => {
    for (let i = 4; i >= 1; i--) {
      await new Promise(r => setTimeout(r, 350));
      setCurrentNumber(i);
      await new Promise(r => setTimeout(r, 350));
      setShowNumber(true);
      await new Promise(r => setTimeout(r, 600));
      setShowNumber(false);
    }

    await new Promise(r => setTimeout(r, 350));
  }

  const selfieAnimation = async () => {
    setSelfieAnimationHappening(true);

    setCurrentInstructions("Look up! (Chin facing camera)");
    await numberAnimation();
    capture(setCapturedImage1);

    setCurrentInstructions("Look down! (Forehead facing camera)");
    await numberAnimation();
    capture(setCapturedImage2);

    setCurrentInstructions("Look left! (Cheek facing camera)");
    await numberAnimation();
    capture(setCapturedImage3);

    setCurrentInstructions("Look forward! (Normal selfie)");
    await numberAnimation();
    capture(setCapturedImage4);

    setCurrentInstructions("Do something crazy! (Whatever you want)");
    await numberAnimation();
    capture(setCapturedImage5);

    await new Promise(r => setTimeout(r, 200));

    collapseCamera();
    setSelfieAnimationHappening(false);
  }

  const collapseCamera = () => {

    const targetComponent = document.getElementById("streamingComponent");
    const videoComponent = document.getElementById("webcamVideo");

    if (targetComponent && videoComponent) {
      targetComponent.style.width = "1px";
      targetComponent.style.height = "1px";
      targetComponent.style.marginTop = "-41px";
      videoComponent.style.width = "1px";
      videoComponent.style.height = "1px";
    }

    setStreaming(false);
  }

  const capture = async (setCapturedImage) => {
    const targetComponent = document.getElementById("streamingComponent");
    const videoComponent = document.getElementById("webcamVideo");

    if (webcamRef.current && targetComponent && videoComponent) {
      const imageSrc = webcamRef.current.getScreenshot();
      await new Promise(r => setTimeout(r, 200));
      setCapturedImage(imageSrc);
    }
  };

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

    if (respJson["user_id"]) setUserId(respJson["user_id"]);

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
      } else if (page !== 1 && page !== 2) {
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
    } else if (page == 3 || page == 4) {
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

  const uploadImagesToS3 = async (capturedImages: (string | null)[]) => {
    // Create a new image element and set its source to the captured image.
    // Define the S3 bucket name and file name
    const bucketName = 'dopple-selfies';

    // Encode the image as a buffer
    for (let i = 0; i < capturedImages.length; i++) {
      const fileName = `selfie-${i}-${userId}.jpg`; // Unique file name

      const imageBlob = await fetch(capturedImages[i] || "").then((response) => response.blob());

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

  }

  const enterDetector = (key: string) => {
    if (key.toUpperCase() == "ENTER") nextClick();
  }

  useEffect(() => {
    async function refocusKeyboard() {
      
      if (textInputRef.current) {
        console.log("BLURRING");
        textInputRef.current.blur();
        await new Promise(r => setTimeout(r, 1000));
        setShouldFocus(true);
      }
    }

    refocusKeyboard();

  }, [textInputRef, page])

  useEffect(() => {
    if (shouldFocus) {
      console.log("ABOUT TO FOCUS AGAIN");
      console.log(textInputRef.current);
      textInputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  useEffect(() => {
    if (page == 3) setPlaceholder("FIRST NAME");
    else if (page == 4) setPlaceholder("LAST NAME");
  }, [page])

  useEffect(() => {
    if (gender !== "") nextClick();
  }, [gender])

  const nextClick = async () => {

    setShow(false);

    // validate input
    if (page == 0 || page == 3 || page == 4) {
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
    } else if (page == 1) {
      uploadImagesToS3([capturedImage1, capturedImage2, capturedImage3, capturedImage4, capturedImage5]);
      const ok = await updateUser({ "images_uploaded": true });
      if (!ok) {
        setErrorMessage("We're having trouble communicating with our servers right now. Try again in a sec!");
        setShow(true);
        return;
      }

    } else if (page == 2) {

      if (themeList.length == 0) {
        setErrorMessage("You must select at least one personality.");
        setShow(true);
        return;
      }
      const ok = await updateUser({ "image_config": themeList });
      if (!ok) {
        setErrorMessage("We're having trouble communicating with our servers right now. Try again in a sec!");
        setShow(true);
        return;
      }
    } else if (page == 3) {
      const ok = await updateUser({ "first_name": text });
      if (!ok) {
        setErrorMessage("We're having trouble communicating with our servers right now. Try again in a sec!");
        setShow(true);
        return;
      }
    } else if (page == 4) {
      const ok = await updateUser({ "last_name": text });
      if (!ok) {
        setErrorMessage("We're having trouble communicating with our servers right now. Try again in a sec!");
        setShow(true);
        return;
      }
    } else if (page == 5) {
      const ok = await updateUser({ "gender": gender })
      if (!ok) {
        setErrorMessage("We're having trouble communicating with our servers right now. Try again in a sec!");
        setShow(true);
        return;
      }
      if (searchParams.get("rc")) {
        fetch(
          `${process.env.REACT_APP_BE_URL}/confirm-referral`,
          {
            method: "POST",
            headers: {
              "auth-token": cookies["user-id"],
            },
            body: JSON.stringify({
              "referral_code": searchParams.get("rc")
            })
          }
        );
      }
    }

    clearTextArea();
    setText("");
    setErrorMessage("");
    setPage(page + 1);
    setShow(true);
  }

  /*
            { page == 1 && streaming && !selfieAnimationHappening && (
            <div className="formTextGap">
              <div className="formSubtext">
                Instructions will be HERE
              </div>
            </div>
          )}
          { page == 1 && selfieAnimationHappening && (
            <div className="formTextGap">
              <div className="formSubtext">
                {currentInstructions}
              </div>
            </div>
          )}
                          {streaming && !selfieAnimationHappening &&  (
                  <>
                    <div className="retakeButton" onClick={selfieAnimation}>
                      <div>📸</div>
                      <div>Are you ready?</div>
                    </div>
                  </>
                )}
  */
 
  return (
    <>
      <div className="overallSignupContainer">
        <div className="signupContainer">
          <animated.div id="formContainer" className="formContainer" style={fadeAnimation}>
            <div className="formText">
              { page == 0 && "Enter your phone number "}
              { page == 1 && !streaming && !selfieAnimationHappening && "Create your dopple "}
              { page == 1 && streaming && !selfieAnimationHappening && "Instructions will be HERE"}
              { page == 1 && selfieAnimationHappening && currentInstructions }
              { page == 2 && "Customize your dopple"}
              { page == 3 && "What's your first name?"}
              { page == 4 && "What's your last name?"}
              { page == 5 && "What's your gender?" }
              { (page == 0 || (page == 1 && !streaming && !capturedImage5)) && (
                <img
                  className="signupInfoButton"
                  src={process.env.PUBLIC_URL + "assets/info.png"}
                  onClick={() => setInfoModalOpen(true)}
                  ref={infoButtonRef}
                />
              )}
            </div>
            { page == 1 && !streaming && !capturedImage5 && (
              <div className="formTextGap">
                <div className="formSubtext">
                  To create your dopple, take some 🔥 selfies
                </div>
              </div>
            )}
            { (page == 0 || page == 3 || page == 4) && (
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
                data-1p-ignore
              />
            )}
            { page == 5 && (
              <div className="genderButtonContainer">
                <GenderButton gender="Boy" setGender={setGender} />
                <GenderButton gender="Girl" setGender={setGender} />
                <GenderButton gender="Non-binary/Other" setGender={setGender} />
              </div>
            )}
            <div id="streamingComponent" className="videoFullCircle">
              { camOpen && (
                <Webcam forceScreenshotSourceSize className="fileInput" screenshotFormat="image/jpeg" audio={false} ref={webcamRef} mirrored={true} onUserMedia={selfieAnimation} />
              )}
              <animated.div className="numberAnimation" style={fadeAnimationQuick}>
                {currentNumber}
              </animated.div>
            </div>
            { page == 1 && (
              <>
                {capturedImage5 && (
                  <img src={capturedImage5} alt="Captured" className="photoFullCircle" />
                )}
                <div className="miniImages">
                  { capturedImage1 && <img src={capturedImage1} alt="Captured" className="miniImage" /> }
                  { capturedImage2 && <img src={capturedImage2} alt="Captured" className="miniImage" /> }
                  { capturedImage3 && <img src={capturedImage3} alt="Captured" className="miniImage" /> }
                  { capturedImage4 && <img src={capturedImage4} alt="Captured" className="miniImage" /> }
                </div>
                {capturedImage5 && (
                  <div className="retakeButton" onClick={() => {
                    /*setCapturedImage1(null);
                    setCapturedImage2(null);
                    setCapturedImage3(null);
                    setCapturedImage4(null);
                    setCapturedImage5(null);*/
                    beginStream().then(() => selfieAnimation());
                  }}>
                    <div>📸</div>
                    <div>Retake Selfies</div>
                  </div>
                )}
                {(!capturedImage5 && !streaming && !selfieAnimationHappening) && (
                  <>
                    <div className="photoEmptyCircle">
                      <img src={process.env.PUBLIC_URL + "assets/user.png"} className="photoPlaceholder" />
                    </div>
                    <div className="photoButtonGroup">
                      <div className="photoButton" onClick={beginStream}>
                        <div className="nextButtonText">🔥 take selfies 🔥</div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            { page == 2 && (
              <>
                {capturedImage5 && (
                  <img src={capturedImage5} alt="Captured" className="photoFullCircle" />
                )}
                <ThemeArea themeList={themeList} setThemeList={setThemeList} isSelecting={true} />
              </>
            )}
            { page == 6 && (
              <ComeBackTomorrow />
            )}
            { errorMessage && (
              <div className="errorText">
                {errorMessage}
              </div>
            )}
          </animated.div>
          { (page !== 1 || capturedImage5) && page !== 5 && page !== 6 && (
            <div id="nextButton" className="nextButton" onClick={(e) => {
              //e.preventDefault();
              /*if (textInputRef.current) {
                //textInputRef.current.blur();
                textInputRef.current.focus();
              }*/
              nextClick();
            }}>
                <div className="nextButtonText">
                  { page == 0 && "Let's create"}
                  {(page == 1 || page == 2) && "Looks good"}
                  {page > 2 && "Next"}
                </div>
              <img src={process.env.PUBLIC_URL + "assets/right-arrow.png"} className="nextButtonArrow" />
            </div>
          )}
        </div>
      </div>
      <InfoModal modalOpen={infoModalOpen} setModalOpen={setInfoModalOpen} buttonRef={infoButtonRef} page={page} />
    </>
  )
};

export default Signup;
