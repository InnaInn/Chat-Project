import React, { useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import Load from "../img/loading.svg";

function MessageList({ messages, userId, showWelcome, fadeOut, welcomeText, isLoading, language, translations }) {
  const msgWrapperRef = useRef(null);

  useEffect(() => {
    const container = msgWrapperRef.current;
    if (!container) return;

    if (container.scrollHeight > container.clientHeight) {
      container.style.overflowY = "auto";
    } else {
      container.style.overflowY = "hidden";
    }

    const lastMessage = container.lastElementChild;
    if (lastMessage) {
      setTimeout(() => {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [messages]);

  return (
    <div className="msgWrapper" ref={msgWrapperRef}>
      {showWelcome && (
        <div className={`welcome ${fadeOut ? "hidden" : ""}`}>
          <h2 className="hi">{welcomeText}</h2>
        </div>
      )}
      {messages.map((msg, index) => (
        <div key={index} className={`msg ${msg.userId === userId ? "my-msg" : ""}`}>
          {msg.userId === "server" ? (
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          ) : (
            msg.text
          )}
        </div>
      ))}
      {isLoading && (
        <div className="spinner">
          <img src={Load} alt="loading" />
          {translations[language].loading}
        </div>
      )}
    </div>
  );
}

export default MessageList;