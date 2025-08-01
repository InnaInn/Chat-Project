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
  textareaRef = { textareaRef },
  isLightTheme,
}) {

  const containerRef = useRef(null);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    const handleFocus = () => {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300); // задержка, чтобы клавиатура успела открыться
    };

    const textarea = textareaRef.current;
    if (isMobile && textarea) {
      textarea.addEventListener("focus", handleFocus);
    }

    return () => {
      if (isMobile && textarea) {
        textarea.removeEventListener("focus", handleFocus);
      }
    };
  }, [textareaRef]);


  return (
    <div className="input">
      <div className="inputContainer" ref={containerRef}>
        <textarea
          className="inputText"
          value={inputText}
          onChange={(e) => {
            handleChange(e);
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={translations[language].messagePlaceholder}
          ref={textareaRef}
          rows="1"
          onFocus={() => {
            const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
            if (isMobile && containerRef.current) {
              setTimeout(() => {
                containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 300);
            }
          }}
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