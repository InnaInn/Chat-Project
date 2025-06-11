import React, { useRef } from "react";
import Voice from "../img/voice.svg";
import Send from "../img/send.svg";

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
  textareaRef={textareaRef},
}) {

  return (
    <div className="input">
      <div className="inputContainer">
        <textarea
          className="inputText"
          value={inputText}
          onChange={(e) => {
            handleChange(e);
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                200
              )}px`;
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={translations[language].messagePlaceholder}
          ref={textareaRef}
          rows="1"
        />
      </div>
      {inputText.trim() === "" ? (
        <div className="voiceContainer">
          {isRecording && <span className="recordingIndicator"></span>}
          <img
            className="voice"
            src={Voice}
            alt={translations[language].startVoice}
            onClick={startVoiceRecognition}
          />
        </div>
      ) : (
        <img
          className="send"
          onClick={sendMessage}
          src={Send}
          alt={translations[language].send}
        />
      )}
    </div>
  );
}

export default MessageInput;