import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import Conversation from '../../components/Conversation';
import ChatBox from '../../components/ChatBox';
import { io } from 'socket.io-client';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure'

const Chat = () => {
    const {user} = useAuth();
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState(null);
    const socket = useRef();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const chatIdParam = searchParams.get('chatId');
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await axiosSecure.get(`/chat/${user.email}`);
                const fetchedChats = response.data;
                setChats(fetchedChats);
    
                if (chatIdParam) {
                    const targetChat = fetchedChats.find(chat => chat._id === chatIdParam);
                    if (targetChat) {
                        setCurrentChat(targetChat);
                    }
                }
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        getChats();
    }, [user.email, chatIdParam]);

    useEffect(() => {
        if (sendMessage !== null) {
            socket.current.emit('send-message', sendMessage);
        }
    }, [sendMessage]);

    useEffect(() => {
        socket.current = io('http://localhost:8001');
        socket.current.emit("new-user-add", user.email);
        socket.current.on('get-users', (users) => {
            setOnlineUsers(users);
        });
    }, [user]);

    useEffect(() => {
        socket.current.on("recieve-message", (data) => {
            setReceiveMessage(data);
        });
    }, []);

    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member) => member!==user.email)
        const online = onlineUsers.find((user) => user.email === chatMember)
        return online? true : false;
    }

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50">
            {/* Left Sidebar */}
            <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="md:w-1/3 lg:w-1/4 w-full bg-white p-4 border-r border-gray-200 shadow-sm"
            >
                <div className="flex flex-col h-full">
                    <div className='flex gap-4 items-center mb-6'>
                        <button 
                            onClick={handleGoBack}
                            className="transition-transform hover:scale-110"
                        >
                            <IoArrowBackCircleSharp className="text-3xl text-green-500 hover:text-green-700" />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
                    </div>
                    
                    <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <motion.div 
                                    key={chat._id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setCurrentChat(chat)} 
                                    className={`cursor-pointer p-3 rounded-lg mb-2 transition-all ${currentChat?._id === chat._id ? 'bg-gradient-to-r from-green-50 to-gray-50 border border-green-100' : 'hover:bg-gray-50'}`}
                                >
                                    <Conversation 
                                        data={chat} 
                                        currentUser={user.email} 
                                        online={checkOnlineStatus(chat)}
                                        isSelected={currentChat?._id === chat._id}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No conversations yet</p>
                                <p className="text-sm text-gray-400 mt-1">Start a new conversation</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Right Chat Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentChat?._id || 'empty'}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col bg-white"
                >
                    {currentChat ? (
                        <ChatBox
                            chat={currentChat}
                            currentUser={user.email}
                            setSendMessage={setSendMessage}
                            receiveMessage={receiveMessage}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6">
                            <div className="max-w-md text-center">
                                <div className="w-24 h-24 bg-green-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
                                <p className="text-gray-500">Choose a chat  to begin messaging</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Chat;