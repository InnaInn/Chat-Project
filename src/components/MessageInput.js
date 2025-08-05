import React, { useRef, useEffect } from "react";
import VoiceDark from "../img/voice_dark.svg";
import SendDark from "../img/send_dark.svg";
import VoiceLight from "../img/voice_light.svg";
import SendLight from "../img/send_light.svg";

function MessageInput({
  inputText,
  setInputText,
  isRecording,
  handleKeyDown,
  handleChange,
  startVoiceRecognition,
  sendMessage,
  translations,
  language,
  textareaRef,
  isLightTheme,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    const scrollToInput = () => {
      if (isMobile && containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scrollToInput);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", scrollToInput);
      }
    };
  }, []);

  const handleFocus = () => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
    if (isMobile && containerRef.current) {
      setTimeout(() => {
        containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  };

  return (
    <div className="input">
      <div className="inputContainer" ref={containerRef}>
        <textarea
          className="inputText"
          value={inputText}
          onChange={(e) => {
            handleChange(e);
            if (textareaRef?.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={translations[language].messagePlaceholder}
          ref={textareaRef}
          rows="1"
          onFocus={handleFocus}
          onTouchStart={handleFocus}
        />
      </div>
      {inputText.trim() === "" ? (
        <div className="voiceContainer">
          {isRecording && <span className="recordingIndicator"></span>}
          <img
            className="voice"
            src={isLightTheme ? VoiceLight : VoiceDark}
            alt={translations[language].startVoice}
            onClick={startVoiceRecognition}
          />
        </div>
      ) : (
        <img
          className="send"
          src={isLightTheme ? SendLight : SendDark}
          alt={translations[language].send}
          onClick={sendMessage}
        />
      )}
    </div>
  );
}

export default MessageInput;