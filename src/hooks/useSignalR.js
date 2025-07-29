import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const endMsgTag = '<|im_end|>';

export function useSignalR(setMessages, userId, setIsLoading, setPageData) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://192.168.0.169:8080/chatHub", { withCredentials: false })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR подключён!");
      } catch (err) {
        console.error("Ошибка подключения SignalR:", err);
        setTimeout(() => startConnection(connection), 3000);
      }
    };

    connection.off("ReceiveStreamMessage");
    connection.on("ReceiveStreamMessage", (user, chunk) => {
      const isFinal = chunk.endsWith(endMsgTag);
      if (isFinal) {
        chunk = chunk.slice(0, -endMsgTag.length);
      }

      setIsLoading(false);

      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.userId === "server") {
          const updated = {
            ...lastMessage,
            text: lastMessage.text + chunk,
            done: isFinal
          };
          return [...prev.slice(0, -1), updated];
        } else {
          return [...prev, { text: chunk, userId: "server", done: isFinal }];
        }
      });
    });

    connection.off("ReceiveRelatedDataMessage");
    connection.on("ReceiveRelatedDataMessage", (server, jsonString) => {
      try {
        const parsed = JSON.parse(jsonString);
        const allPageData = parsed.Data.map(item => item.PageData);
        setPageData(allPageData);
      } catch (error) {
        console.error("Ошибка при парсинге JSON:", error, jsonString);
      }
    });

    startConnection();
    setSocket(connection);

    return () => {
      connection.off("ReceiveStreamMessage");
      connection.stop();
    };
  }, [setMessages]);

  return socket;
}