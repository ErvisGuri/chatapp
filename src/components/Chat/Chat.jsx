import React, { useEffect, useState } from "react";

import "../Chat/Chat.css";

import ScrollToBottom from "react-scroll-to-bottom";
import wawallpaper from "../../images/wawallpaper.jpg";

import io from "socket.io-client";
const socket = io.connect("http://localhost:3002");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messageReceive, setMessageReceive] = useState([]);
  const [username, setUsername] = useState("");

  const clearInput = () => {
    setMessage("");
    setUsername("");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message !== "") {
      const messageData = {
        name: username,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        id: Math.floor(Math.random() * 1000),
      };
      console.log("v", messageData);
      await socket.emit("send_message", messageData);
      setMessageReceive((list) => [...list, messageData]);
    }
    // clearInput();
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("2", data);
      setMessageReceive((list) => [
        ...list?.filter((el) => el?.message !== data?.message),
        data,
      ]);
    });
  }, [socket]);

  return (
    <div className="chat_container">
      <div className="enterName">
        <input
          value={username}
          type="text"
          style={{ marginBottom: 25, borderRadius: 5 }}
          placeholder="Enter Your Name"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="chat-header">
        <span>Live Chat</span>
      </div>
      <div
        className="chat-body"
        style={{ backgroundImage: `url(${wawallpaper})` }}
      >
        <ScrollToBottom className="message_container">
          {messageReceive.map((messageContent, key) => {
            console.log(messageReceive);
            return (
              <div
                key={key}
                className="message"
                id={username === messageContent.name ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p style={{ fontSize: 20 }}>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p style={{ fontSize: 10 }} id="time">
                      {messageContent.time}
                    </p>
                    <p style={{ fontSize: 10 }} id="name">
                      {messageContent.name}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <div>
          <input
            className="inputchat"
            placeholder="Message...."
            type="text"
            onChange={(e) => setMessage(e.target.value)}
          ></input>
        </div>
        <div>
          <button className="buttonchat" type="submit" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
