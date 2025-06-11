import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const endMsgTag = '<|im_end|>';

export function useSignalR(setMessages, userId) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:8080/chatHub", { withCredentials: false })
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

    startConnection();
    setSocket(connection);

    return () => {
      connection.off("ReceiveStreamMessage");
      connection.stop();
    };
  }, [setMessages]);

  return socket;
}