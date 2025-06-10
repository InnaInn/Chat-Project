import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Send from "./img/send.svg";
import Voice from "./img/voice.svg";
import * as signalR from "@microsoft/signalr";

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
  const endMsgTag = '<|im_end|>';

  /*Переподключение через 3 сек , сели сервер не запущен*/

  const startConnection = async (connection) => {
    try {
      await connection.start();
      console.log("SignalR подключён!");
    } catch (err) {
      console.error("Ошибка подключения SignalR:", err);
      setTimeout(() => startConnection(connection), 3000);
    }
  };

  /*Подключение к SignalR*/

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:8080/chatHub", { withCredentials: false })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    startConnection(connection);

    connection.off("ReceiveStreamMessage");
    connection.on("ReceiveStreamMessage", (user, chunk) => {
      if (chunk.endsWith(endMsgTag)) {

        chunk = chunk.slice(0, -endMsgTag.length);
      }
      setMessages(prev => {
        let lastMessage = null;

        if (prev.length > 0) {
          lastMessage = prev[prev.length - 1];
        }

        if (lastMessage && lastMessage.userId === "server") {
          return [
            ...prev.slice(0, -1),
            { text: lastMessage.text + chunk, userId: "server" }
          ];
        } else {
          return [...prev, { text: chunk, userId: "server" }];
        }
      });
    });

    setSocket(connection);

    return () => {
      connection.off("ReceiveStreamMessage");
      connection.stop();
    };
  }, []);

  /*Отправка сообщений*/

  const sendMessage = () => {
    if (!socket || socket.state !== signalR.HubConnectionState.Connected) {
      console.error("SignalR ещё не подключён, попробуйте снова");
      return;
    }
    let gameName = '';
    socket.invoke("StreamMessage", userId, inputText)
      .catch(err => console.error("Ошибка при отправке:", err));

    setMessages(prev => [...prev, { text: inputText, userId }]);

    setInputText("");

    if (showWelcome) {
      setFadeOut(true);
      setShowWelcome(false);
    }


    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };
  console.log(messages, "messages");


  /*Язык*/

  const translations = {
    ru: {
      welcome: "Привет 👋! Начни общение прямо сейчас!",
      messagePlaceholder: "Сообщение...",
      changeLanguage: "Сменить язык",
      send: "Отправить",
      startVoice: "Голосовой ввод",
      gamePlaceholder: "Выберите игру или начните ввод...",
      gameOptions: ["Древний Ужас", "Колонизаторы", "Root", "Это моя война", "Эволюция"],
    },
    en: {
      welcome: "Hey there 👋! Start chatting right now!",
      messagePlaceholder: "Message...",
      changeLanguage: "Change language",
      send: "Send",
      startVoice: "Voice Input",
      gamePlaceholder: "Choose a game or start typing...",
      gameOptions: ["Eldritch Horror", "Catan", "Root", "This War of Mine", "Evolution"],


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
        <div className="leftSection">
          <div className='toggleSwitch'>
            <label>
              <input className="checkboxTheme" type='checkbox' />
              <span className='slider'></span>
            </label>
          </div>
          <div className="gameList">
            <input
              className="gameInput"
              list="gameList"
              placeholder={translations[language].gamePlaceholder}
            />
            <datalist id="gameList">
              {translations[language].gameOptions.map((title, index) => (
                <option key={index} value={title}></option>
              ))}
            </datalist>
          </div>
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