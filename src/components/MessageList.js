import React, { useEffect, useRef } from "react";

function MessageList({ messages, userId, showWelcome, fadeOut, welcomeText }) {
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
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default MessageList;