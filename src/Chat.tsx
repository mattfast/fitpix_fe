import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"
//import useWebSocket, { ReadyState } from 'react-use-websocket';
import { io } from "socket.io-client";

import "@fontsource/rubik";
import "@fontsource/rubik/500.css"; 
import "@fontsource/rubik/700.css"; 
import "@fontsource/figtree";
import "@fontsource/figtree/600.css";
import "./Chat.css";
import "./Loader.css"
import makeCookie from "./utils";

import Modal from "./Modal";

import { TikTok } from 'react-tiktok';
import { Spotify } from 'react-spotify-embed';
import { useCookies } from 'react-cookie';

type MessageGroup = {
  messages: string[];
  isUser: boolean;
  type: string;
}

type BackendMessage = {
  content: string;
  role: string;
}

const socket = io(process.env.REACT_APP_BACKEND_URL || "", { transports: ['websocket'] });

const firstMessages = [
  {
    messages: ["hey!"],
    isUser: false,
    type: "plaintext"
  },
  {
    messages: ["i'm your high school's ai"],
    isUser: false,
    type: "plaintext"
  },
  {
    messages: ["use me to rant, gossip, or de-stress"],
    isUser: false,
    type: "plaintext"
  },
  {
    messages: ["you go to lex right?"],
    isUser: false,
    type: "plaintext"
  },
]

const Chat = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user-id']);
  //const [currCookie, setCurrCookie] = useState<string>("");
  const [sid, setSid] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageGroups, setMessageGroups] = useState<MessageGroup[]>([]);
  const [showTypingIndicator, setShowTypingIndicator] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [firstMessagesSent, setFirstMessagesSent] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Sign up");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const onTextInput = async (i: string) => {
    if (i[i.length - 1] == "\n") {
      if (i.length == 1) {
        clearTextArea();
      } else {
        await sendChatMessage();
      }

      return;
    }
    setMessage(i);
    const el = document.getElementById("messageArea");
    if (el) {
      el.style.height = 'auto';
      el.style.height = (el.scrollHeight == 0) ? "36px" : (el.scrollHeight - 5) + "px";
    }
  }

  const clearTextArea = () => {
    const el = document.getElementById("messageArea") as HTMLInputElement;
    if (el) el.value = "";
    setMessage("");
  }

  const updateScroll = () => {
    const el = document.getElementById("messagesContainer");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  const sendChatMessage = async () => {
    
    // interval to scroll to bottom
    const refreshIntervalId = setInterval(updateScroll, 100);

    // display message
    await addMessage(message, true, "plaintext");

    // clear textarea
    clearTextArea();

    // send request 
    socket.emit("message", { "msg": message, "cookie": cookies["user-id"], "sid": sid });

    // stop interval after message displayed
    await new Promise(r => setTimeout(r, 1000));
    clearInterval(refreshIntervalId);
  };

  const addMessage = async (message: string, isUser: boolean, type: string) => {
    setMessageGroups(groups => [...groups, {
      messages: [message],
      isUser,
      type
    }]);
  }

  const createOrSendCookie = async () => {
    let cookie = cookies["user-id"];
    if (!cookie) {
      cookie = makeCookie(32);
      setCookie("user-id", cookie, { expires: new Date(2030, 0) });
    }

    socket.emit("cookie", { "cookie": cookie, "sid": sid });
  }

  const sendFirstMessages = async () => {
    if (firstMessagesSent) return;

    setMessageGroups([]);

    setShowTypingIndicator(true);
    await new Promise(r => setTimeout(r, 200));
    setShowTypingIndicator(false);
    addMessage("hey!", false, "plaintext");
    setShowTypingIndicator(true);
    await new Promise(r => setTimeout(r, 600));
    setShowTypingIndicator(false);
    addMessage("i'm your high school's ai", false, "plaintext");
    setShowTypingIndicator(true);
    await new Promise(r => setTimeout(r, 600));
    setShowTypingIndicator(false);
    addMessage("use me to rant, gossip, or de-stress", false, "plaintext");
    setShowTypingIndicator(true);
    await new Promise(r => setTimeout(r, 500));
    setShowTypingIndicator(false);
    addMessage("you go to lex right?", false, "plaintext");

    setFirstMessagesSent(true);
  }

  const resizeChat = () => {
    const el1 = document.getElementById("chatHeader");
    const el2 = document.getElementById("messagesContainer");
    const px = window.visualViewport?.height;
    if (el1 && px) el1.style.marginTop = "calc(100dvh - " + px + "px)";
    //if (el2 && px) el2.style.bottom = "calc(100dvh - " + px + "px)";
    if (el2 && px) el2.style.height = "calc(" + px + "px - 220px)";
  }

  setInterval(resizeChat, 100);

  const populatePrevMessages = async (messages: BackendMessage[]) => {
    const newMessages = messages.map(m => {
      let type = "plaintext";
      if (m["content"].startsWith("https://www.tiktok.com")) {
        type = "tiktok";
      } else if (m["content"].startsWith("https://open.spotify.com")) {
        type = "spotify";
      }

      return {
        messages: [m["content"]],
        isUser: m["role"] == "human",
        type
      }
    })

    setMessageGroups([ ...firstMessages, ...newMessages ]);
    const refreshIntervalId = setInterval(updateScroll, 100);
    stopInterval(refreshIntervalId);
  }

  useEffect(() => {
    socket.on("connection", (data) => {
      console.log("RECEIVED CONNECTION")
      console.log(data)
      setSid(data.sid as string);
      createOrSendCookie();
    });

    return () => {
      socket.off("connection");
    };
  }, []);

  useEffect(() => {
    socket.on("modal", (data) => {
      if (data.provided) {
        setButtonText("Share");
      }
    });

    return () => {
      socket.off("modal");
    };
  }, []);

  useEffect(() => {
    socket.on("previousMessages", (data) => {
      console.log("RECEIVED PREV MESSAGES")
      console.log(data.messages)
      if (data.messages.length == 0) {
        console.log("SENDING FIRST MESSAGES");
        sendFirstMessages();
      } else {
        console.log("POPULATING PREV MESSAGES")
        populatePrevMessages(data.messages);
        setShowTypingIndicator(false);
      }
    });

    return () => {
      socket.off("previousMessages");
    };
  }, []);


  useEffect(() => {
    socket.on("message", (data) => {
      console.log("RECEIVED MESSAGE");
      console.log(data);
      const refreshIntervalId = setInterval(updateScroll, 100);

      const msg = data.msg as string;
      if (msg.startsWith("https://www.tiktok.com")) {
        addMessage(data.msg as string, false, "tiktok");
        setModalOpen(true);
      } else if (msg.startsWith("https://open.spotify.com")) {
        addMessage(data.msg as string, false, "spotify");
      } else {
        addMessage(data.msg as string, false, "plaintext");
      }

      setShowTypingIndicator(false);
      stopInterval(refreshIntervalId);
    });

    return () => {
      socket.off("message");
    };

  }, []);

  const showAITyping = async (waitTime: number) => {
    const refreshIntervalId = setInterval(updateScroll, 100);
    await new Promise(r => setTimeout(r, waitTime));
    setShowTypingIndicator(true);
    await stopInterval(refreshIntervalId);
  }
 
  const stopInterval = async (timer: NodeJS.Timer) => {
    await new Promise(r => setTimeout(r, 1000));
    clearInterval(timer);
  }
  
  useEffect(() => {
    socket.on("typing", (data) => {
      console.log("RECEIVED TYPING INDICATOR");
      const waitTime = data?.secondary ? 200 : 1500;
      showAITyping(waitTime);
    });

    return () => {
      socket.off("typing");
    };
  }, []);

  /*useEffect(() => {
    socket.on("finishConversation", (data) => {
      setModalOpen(true);
    });

    return () => {
      socket.off("finishConversation");
    };
  }, []);*/
 
  //                <img className="typingIndicator" src={process.env.PUBLIC_URL + "assets/typing.gif"} />

          /*{ showTypingIndicator && (<div className="chatGroupAI">
              <div className="chatCellTyping">
                <div className="loader"/>
              </div>
            </div>
          )}*/

  return (
    <>
      <div className="chatContainer">
        <div id="chatHeader" className="chatHeader">
          <div className="topLogo">
            <img className="milk" src={process.env.PUBLIC_URL + "assets/milk-carton.png"} />
            <div className="name">Milk AI</div>
          </div>
          <div ref={buttonRef} className="button" onClick={() => setModalOpen(true)}>
            <div className="buttonText">
              {buttonText}
            </div>
          </div>
        </div>
        <div id="messagesContainer" className="messagesContainer">
          { messageGroups.map(g => (
            <div className={g.isUser ? "chatGroupHuman" : "chatGroupAI"}>
              { g.messages.map(m => (
                <div className={g.isUser ? "chatCellHuman" : "chatCellAI"}>
                  { g.type == "plaintext" && (<div className="chatCellText">{m}</div>)}
                  { g.type == "tiktok" && (
                    <div className="chatCellTikTok">
                      <div className="tiktokStyle">
                        <TikTok url={m} />
                      </div>
                    </div>
                  )}
                  { g.type == "spotify" && (
                    <div className="chatCellSpotify">
                      <div className="spotifyStyle">
                        <Spotify link={m} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          { showTypingIndicator && (<div className="chatGroupAI">
              <div className="chatCellTyping">
                <div className="loader"/>
              </div>
            </div>
          )}
        </div>
        <div id="textContainer" className="textContainer">
          <textarea id="messageArea" ref={inputRef} rows={1} placeholder="Message..." onChange={(e) => {
            onTextInput(e.currentTarget.value)
          }}/>
          <div className={message.length > 0 ? "sendButtonRed" : "sendButtonGray"} onClick={(e) => {
            e.preventDefault();
            if (inputRef.current) inputRef.current.focus();
            sendChatMessage();
          }}>
            <img className="arrowUp" src={process.env.PUBLIC_URL + "assets/arrow-down.png"} />
          </div>
        </div>
      </div>
      <Modal open={modalOpen} buttonRef={buttonRef} sid={sid} socket={socket} cookie={cookies["user-id"]} setModalOpen={setModalOpen} isLandingPage={false} startPage={buttonText == "Share" ? 2 : 0} />
    </>
  )
};

export default Chat;
