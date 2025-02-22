import React, { useEffect, useState, useRef } from "react";
import InputEmoji from "react-input-emoji";
import { format } from "timeago.js";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const imageRef = useRef();
  const scroll = useRef();

    // Scroll to bottom when messages change
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  useEffect(() => {
    if(receiveMessage!==null&&receiveMessage.chatId===chat._id){
        setMessages((prevMessages) => [...prevMessages, receiveMessage]);
    }
  }, [receiveMessage]);
  
  useEffect(() => {
    const email = chat?.members?.find((email) => email !== currentUser);
    
    const getUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${email || currentUser}`);
        const data = await response.json();
        setUserData(data);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:3000/message/${chat._id}`);
            const user = await response.json();
            setMessages(user);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    if (chat !== null) fetchMessages();
}, [chat]);

  // Handle new message input
  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // Always scroll to last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    // Send message to the socket server
    const receiverId = chat?.members?.find((id) => id !== currentUser);
    setSendMessage({...message, receiverId});

    try {
        const response = await fetch("http://localhost:3000/message/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error("Failed to send message");
        }

        const data = await response.json();

        if (data && data.text) {
            setMessages([...messages, data]);
            setNewMessage("");
        }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen grid grid-rows-[14vh_73vh_13vh] bg-white rounded-lg shadow-md">
  {chat ? (
    <>
      {/* Chat Header */}
      <div className="chat-header flex flex-col px-4 pt-4">
        <div className="follower flex items-center">
          <div className="relative">
            <img
              src={userData?.photoURL || "https://i.ibb.co/tPJnyqL1/btmn.jpg"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
            />
          </div>
          <div className="ml-4">
            <span className="text-sm font-medium text-gray-800">
              {userData?.name || "Unknown User"}
            </span>
          </div>
        </div>
        <hr className="border-t border-gray-300 my-4" />
      </div>

      {/* Chat Body */}
      <div className="chat-body flex-grow flex flex-col gap-2 px-6 py-4 overflow-y-scroll">
        {messages.map((message, index) => (
          <div
            key={message?._id || index}
            className={`message flex flex-col gap-2 p-3 rounded-lg max-w-lg ${
              message?.senderId === currentUser
                ? "self-end bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-br-none"
                : "self-start bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            <span>{message?.text || "Message text unavailable"}</span>
            <span className="text-xs text-gray-500 self-end">
              {message?.createdAt ? format(message.createdAt) : "Just now"}
            </span>
          </div>
        ))}
        <div ref={scroll}></div>
      </div>

      {/* Chat Sender */}
      <div className="chat-sender mt-20 flex items-center justify-between bg-white px-4 py-2 rounded-lg shadow-md">
        <InputEmoji
          value={newMessage}
          onChange={handleChange}
          className="flex-1 mx-4 bg-gray-200 rounded-lg text-gray-800 px-4 py-2 outline-none"
        />
        <button
          className="send-button bg-gradient-to-r from-orange-400 to-orange-600 text-white font-medium py-2 px-4 rounded-lg hover:from-orange-500 hover:to-orange-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </>
  ) : (
    <span className="chatbox-empty-message text-gray-500 flex items-center justify-center text-sm">
      Tap on a chat to start conversation...
    </span>
  )}
</div>

  );
};

export default ChatBox;
