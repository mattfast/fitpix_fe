import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree";
import "@fontsource/figtree/600.css";
import "./InfoModal.css";

const InfoModal = ({ setModalOpen, modalOpen, buttonRef, page }: {
  setModalOpen: (arg0: boolean) => void,
  modalOpen: boolean,
  buttonRef: React.RefObject<HTMLDivElement> | React.RefObject<HTMLImageElement>,
  page?: number
}) => {
  const [closable, setClosable] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const modal = document.getElementById("modal");
    if (modalOpen) {
      if (modal) modal.style.display = "flex";
    } else {
      if (modal) modal.style.display = "none";
    }
  }, [modalOpen])

  useEffect(() => {
    setModalClose();
  }, [modalOpen])

  const setModalClose = async () => {
    if (modalOpen) {
      await new Promise(r => setTimeout(r, 200));
      setClosable(true);
    } else {
      setClosable(false);
    }
  }

  window.addEventListener('click', function(e) {
    if (containerRef !== null && buttonRef !== null) {
      let containsElement = e.composedPath().includes(containerRef.current as EventTarget);
      let containsButton = e.composedPath().includes(buttonRef.current as EventTarget);
      if (!containsElement && !containsButton && closable) {
        setModalOpen(false);
        setClosable(false);
      }
    }
  });
 
  return (
    <div id="modal" className="modal">
      <div ref={containerRef} className="modalContent">
        <div className="form">
          <div className="loginFormText">
            <div className="formEmoji">
              { page === undefined && "🖼" }
              { page === 0 && "💬" }
              { page === 1 && "📸" }
            </div>
            <div className="formTitle">
              { page === undefined && "a dopple = one of these cool pics" }
              { page === 0 && "know when your dopple's ready" }
              { page === 1 && "make your dopple look like you" }
            </div>
            <div className="formDescription">
              { page === undefined && "Create 10 of you in under 1 minute." }
              { page === 0 && "we'll text you, so you don't have to keep checking" }
              { page === 1 && "don't worry, nobody will see these selfies except you (not even us)" }
            </div>
            <div className="formDescription">
              { page === undefined && "Share and vote on friends." }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default InfoModal;
