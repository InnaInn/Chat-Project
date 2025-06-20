
import React, { useState, useRef } from "react";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import { useSignalR } from "./hooks/useSignalR";
import translations from "./locales/translations";
import { useVoiceRecognition } from "./hooks/useVoiceRecognition";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("en");
  const textareaRef = useRef(null);



  const socket = useSignalR(setMessages, userId);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ru" ? "en" : "ru"));
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (!socket || socket.state !== "Connected") {
      console.error("SignalR ещё не подключён, попробуйте снова");
      return;
    }

    socket.invoke("StreamMessage", userId, inputText).catch((err) =>
      console.error("Ошибка при отправке:", err)
    );

    setMessages((prev) => [...prev, { text: inputText, userId }]);
    setInputText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }

    if (showWelcome) {
      setFadeOut(true);
      setShowWelcome(false);
    }
  };

  const { startRecognition } = useVoiceRecognition(
    isRecording,
    setIsRecording,
    language,
    setInputText
  );

  return (
    <>
      <Header
        language={language}
        toggleLanguage={toggleLanguage}
        translations={translations}
      />

      <div className="wrapper">
        <MessageList
          messages={messages}
          userId={userId}
          showWelcome={showWelcome}
          fadeOut={fadeOut}
          welcomeText={translations[language].welcome}
        />
        <MessageInput
          inputText={inputText}
          setInputText={setInputText}
          isRecording={isRecording}
          handleKeyDown={handleKeyDown}
          handleChange={handleChange}
          startVoiceRecognition={startRecognition}
          sendMessage={sendMessage}
          translations={translations}
          language={language}
          textareaRef={textareaRef}
        />
      </div>
    </>
  );
}

export default App;