import React, { useState, useRef, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState('');

  const socket = useSignalR(setMessages, userId, setIsLoading, setPageData);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ru" ? "en" : "ru"));
  };

  const [isLightTheme, setIsLightTheme] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  useEffect(() => {
    document.body.classList.toggle("light-theme", isLightTheme);
    localStorage.setItem("theme", isLightTheme ? "light" : "dark");
  }, [isLightTheme]);

  const handleThemeToggle = (e) => {
    setIsLightTheme(e.target.checked);
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

    setIsLoading(true);

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
        isLightTheme={isLightTheme}
        onToggleTheme={handleThemeToggle}
      />

      <div className="wrapper">
        <MessageList
          messages={messages}
          userId={userId}
          showWelcome={showWelcome}
          fadeOut={fadeOut}
          welcomeText={translations[language].welcome}
          isLoading={isLoading}
          language={language}
          translations={translations}
          isLightTheme={isLightTheme}
          pageData={pageData}
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
          isLightTheme={isLightTheme}
        />
      </div>
    </>
  );
}

export default App;