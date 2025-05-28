import React, { useState, useEffect } from "react";
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

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("✅ WebSocket подключён!");
      setSocket(ws);
    };

    ws.onerror = (event) => {
      console.error("🔥 WebSocket ошибка:", event);
    };

    ws.onclose = (event) => {
      console.warn("🚫 WebSocket закрыт! Код:", event.code, "Причина:", event.reason);
    };
    /*
  
    ws.onmessage = (event) => {
      console.log("🚫 Received message:", event);
      let messageText = JSON.parse(event.data).text;
      alert(messageText);
    };
    */

    ws.onmessage = (event) => {
      console.log("🚫 Received message:", event);
      let messageText = JSON.parse(event.data).text;

      setMessages((prev) => [...prev, { text: messageText, userId: "server" }]);
    };


    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket ещё не готов, попробуйте снова");
      return;
    }

    if (inputText.trim() !== "") {
      const newMessage = { text: inputText, userId };

      setMessages((prev) => [...prev, newMessage]); // Добавляем сразу в state

      socket.send(JSON.stringify(newMessage)); // Отправляем на сервер
      setInputText(""); // Очищаем поле ввода
    }
    if (showWelcome) {
      setFadeOut(true); // Запускаем анимацию исчезновения
      setTimeout(() => setShowWelcome(false), 1500); // Ждём 1.5 секунды перед удалением
    }
  };

  console.log(messages, "messages");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращает перенос строки
      sendMessage(); // Вызывает функцию отправки сообщения
    }
  };

  const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = language === "ru" ? "ru-RU" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsRecording(true); // Включаем индикатор

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInputText(speechText);
      setIsRecording(false); // Отключаем индикатор
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
        <button className="languageButton" onClick={toggleLanguage}>
          {translations[language].changeLanguage}
        </button>
      </header>
      <div className="wrapper">
        {showWelcome && (
          <div className={`welcome ${fadeOut ? "hidden" : ""}`}>
            <h2>{translations[language].welcome}</h2>
          </div>
        )}

        <div className="msgWrapper">
          {messages.map((msg, index) => (
            <div className={`msg ${msg.userId === userId ? "my-msg" : ""}`} key={index}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input">
          <div className="inputContainer">
            <input
              className="inputText"
              value={inputText}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Добавляем обработчик Enter
              placeholder={translations[language].messagePlaceholder}
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