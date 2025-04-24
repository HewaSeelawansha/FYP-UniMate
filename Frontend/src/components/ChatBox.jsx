import React, { useEffect, useState, useRef } from "react";
import InputEmoji from "react-input-emoji";
import { format } from "timeago.js";
import { motion, AnimatePresence } from "framer-motion";
import { FiPaperclip, FiMic, FiSend } from "react-icons/fi";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scroll = useRef();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if(receiveMessage !== null && receiveMessage.chatId === chat._id){
      setMessages((prevMessages) => [...prevMessages, receiveMessage]);
    }
  }, [receiveMessage]);
  
  useEffect(() => {
    if (chat) {
        setIsLoading(true);
        // Fetch user data and messages
        const fetchData = async () => {
            try {
              const email = chat?.members?.find((email) => email !== currentUser);
              const [userResponse, messagesResponse] = await Promise.all([
                axiosSecure.get(`/users/${email || currentUser}`),
                axiosSecure.get(`/message/${chat._id}`)
              ]);
              setUserData(userResponse.data);
              setMessages(messagesResponse.data);
            } catch (error) {
                console.error("Error loading chat data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }
}, [chat, currentUser, axiosSecure]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
    // Here you would typically emit a typing event to the socket
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    const receiverId = chat?.members?.find((id) => id !== currentUser);
    setSendMessage({...message, receiverId});

    try {
      const response = await axiosSecure.post("/message/", message);
      if (response.data && response.data.text) {
        setMessages([...messages, response.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={userData?.photoURL || "https://i.ibb.co/tPJnyqL1/btmn.jpg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />
            {/* <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${userData?.email !== currentUser ? 'bg-emerald-500' : 'bg-gray-400'}`}></span> */}
          </div>
          <div className="ml-3">
            <h4 className="font-semibold text-gray-800">{userData?.name || "Unknown User"}</h4>
            <p className="text-xs text-gray-500">
              {userData?.email !== currentUser ? 
                ('Say Hello!') : 
                'you'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <motion.div
            key={message?._id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            ref={scroll}
            className={`flex ${message?.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${message?.senderId === currentUser
                ? 'bg-green-400 shadow-lg text-black rounded-br-none'
                : 'bg-white text-black shadow-lg rounded-bl-none border border-gray-100'
              }`}
            >
              <p className="text-sm">{message?.text}</p>
              <p className={`text-xs mt-1 ${message?.senderId === currentUser ? 'text-gray-700 font-semibold' : 'font-semibold text-gray-500'}`}>
                {message?.createdAt ? format(message.createdAt) : "Just now"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-gray-100">
            <FiPaperclip className="text-xl" />
          </button>
          
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <InputEmoji
              value={newMessage}
              onChange={handleChange}
              placeholder="Type a message..."
              cleanOnEnter={false}
              onEnter={handleSend}
              fontSize={14}
              fontFamily="inherit"
              borderColor="transparent"
              borderRadius={24}
              keepOpened={true}
            />
          </div>
          
          {newMessage ? (
            <button
              type="submit"
              className="p-2 text-white bg-gradient-to-r from-green-500 to-green-400 rounded-full hover:from-green-600 hover:to-green-500 transition-all shadow-md"
            >
              <FiSend className="text-lg" />
            </button>
          ) : (
            <button type="button" className="p-2 text-gray-500 hover:text-green-500 rounded-full hover:bg-gray-100">
              <FiMic className="text-xl" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatBox;