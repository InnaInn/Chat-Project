import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Send from "./img/send.svg";
import Voice from "./img/voice.svg";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("en");
  const msgWrapperRef = useRef(null);
  const textareaRef = useRef(null);

  /*Подключение к WebSocket*/

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log(" WebSocket подключён!");
      setSocket(ws);
    };

    ws.onerror = (event) => {
      console.error("WebSocket ошибка:", event);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket закрыт! Код:", event.code, "Причина:", event.reason);
    };

    ws.onmessage = (event) => {
      console.log("Received message:", event);
      let messageText = JSON.parse(event.data).text;

      setMessages((prev) => [...prev, { text: messageText, userId: "server" }]);
    };


    return () => ws.close();
  }, []);

  /*Язык*/

  const translations = {
    ru: {
      welcome: "Привет 👋! Начни общение прямо сейчас!",
      messagePlaceholder: "Сообщение...",
      changeLanguage: "Сменить язык",
      send: "Отправить",
      startVoice: "Голосовой ввод",
    },
    en: {
      welcome: "Hey there 👋! Start chatting right now!",
      messagePlaceholder: "Message...",
      changeLanguage: "Change language",
      send: "Send",
      startVoice: "Voice Input",
    },
  };

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "ru" ? "en" : "ru"));
  };

  /*Расширение textarea, если слишком длинное сообшение*/

  const handleChange = (e) => {
    setInputText(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  /*Прокрутка сообщений браузер*/

  useEffect(() => {
    if (msgWrapperRef.current) {
      const container = msgWrapperRef.current;

      if (container.scrollHeight > container.clientHeight) {
        container.style.overflowY = "auto";
      } else {
        container.style.overflowY = "hidden";
      }
      const lastMessage = container.lastElementChild;
      if (lastMessage) {
        setTimeout(() => {
          lastMessage.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [messages]);

  /*Отправка сообщений*/

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket ещё не готов, попробуйте снова");
      return;
    }

    if (inputText.trim() !== "") {
      const newMessage = { text: inputText, userId };
      setMessages((prev) => [...prev, newMessage]);
      socket.send(JSON.stringify(newMessage));
      setInputText("");

      if (showWelcome) {
        setFadeOut(true);
        setShowWelcome(false);
      }

      // Сброс высоты  textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    }
  };
  console.log(messages, "messages");

  /*Отправка на Enter*/

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  /*Голосовой ввод*/

  const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language === "ru" ? "ru-RU" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInputText(speechText);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <>
      <header className="header">
        <div className='toggleSwitch'>
          <label>
            <input type='checkbox' />
            <span className='slider'></span>
          </label>
        </div>
        <div>
          <button className="languageButton" onClick={toggleLanguage}>
            {translations[language].changeLanguage}
          </button>
        </div>
      </header>
      <div className="wrapper">
        <div className="msgWrapper" ref={msgWrapperRef}>
          {showWelcome && (
            <div className={`welcome ${fadeOut ? "hidden" : ""}`}>
              <h2 className="hi">{translations[language].welcome}</h2>
            </div>
          )}
          {messages.map((msg, index) => (
            <div className={`msg ${msg.userId === userId ? "my-msg" : ""}`} key={index}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="input">
          <div className="inputContainer">
            <textarea
              className="inputText"
              value={inputText}
              onChange={handleChange}
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
            <img className="send" onClick={sendMessage} src={Send} alt={translations[language].send} />
          )}
        </div>
      </div>
    </>
  );
}
export default App;