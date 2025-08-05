import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import LoadDark from "../img/loading_dark.svg";
import LoadLight from "../img/loading_light.svg";
import DetailesIcon from "../img/details_icon.svg";

function MessageList({
  messages,
  userId,
  showWelcome,
  fadeOut,
  welcomeText,
  isLoading,
  language,
  translations,
  isLightTheme,
  pageData
}) {
  const msgWrapperRef = useRef(null);
  const lastMessageRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const container = msgWrapperRef.current;
    if (!container) return;

    if (container.scrollHeight > container.clientHeight) {
      container.style.overflowY = "auto";
    } else {
      container.style.overflowY = "hidden";
    }


    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  return (
    <div className="msgWrapper" ref={msgWrapperRef}>
      {showWelcome && (
        <div className={`welcome ${fadeOut ? "hidden" : ""}`}>
          <h2 className="hi">{welcomeText}</h2>
        </div>
      )}

      {messages.map((msg, index) => {
        const isLastMessage = index === messages.length - 1;
        const isServerMessage = msg.userId === "server";

        return (
          <div
            key={index}
            ref={isLastMessage ? lastMessageRef : null}
            className={`msg ${msg.userId === userId ? "my-msg" : ""}`}
          >
            {isServerMessage ? (
              <>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
                {msg.done && isLastMessage && (
                  <div className="detailsBlock">
                    <button className="details" onClick={() => setShowPopup(true)}>
                      <img src={DetailesIcon} alt="" className="detailsIcon" />
                    </button>

                    {showPopup && (
                      <>
                        <div
                          className="popupOverlay"
                          onClick={() => setShowPopup(false)}
                        ></div>
                        <div
                          className="popup"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="popupContent">
                            {pageData}
                            <button className="closeBtn" onClick={() => setShowPopup(false)}>
                              &#10006;
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              msg.text
            )}
          </div>
        );
      })}

      {isLoading && (
        <div className="spinner">
          <img src={isLightTheme ? LoadLight : LoadDark} alt="loading" />
          {translations[language].loading}
        </div>
      )}
    </div>
  );
}

export default MessageList;