import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import Conversation from '../../components/Conversation';
import ChatBox from '../../components/ChatBox';
import { io } from 'socket.io-client';
import useAuth from '../../hooks/useAuth';

const Chat = () => {
    const {user} = useAuth();
    //const { user } = useSelector((state) => state.auth);
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState(null);
    const socket = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await fetch(`http://localhost:3000/chat/${user.email}`)
                const data = await response.json();
                setChats(data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        getChats();
    }, [user.email]);

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
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left */}
            <div className="md:w-1/4 w-full bg-gray-100 p-4 border-r">
                <div className="flex flex-col h-full">
                    <div className='flex gap-5 items-center mb-4'>
                        <button onClick={handleGoBack}>
                            <IoArrowBackCircleSharp className="text-3xl hover:text-blue-500" />
                        </button>
                        <h2 className="text-3xl font-semibold">Chats</h2>
                    </div>
                    <div className="overflow-y-auto">
                        {chats.map((chat) => (
                            <div onClick={() => setCurrentChat(chat)} key={chat._id} className="cursor-pointer hover:bg-gray-200">
                                <Conversation data={chat} currentUser={user.email} online={checkOnlineStatus(chat)}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="md:w-3/4 w-full h-screen flex flex-col bg-white">
                {/*<div className="flex justify-end p-4 space-x-4 border-b">
                    <Link to="/">
                        <RiHomeSmile2Fill className="text-xl" />
                    </Link>
                </div>*/}
                <ChatBox
                    chat={currentChat}
                    currentUser={user.email}
                    setSendMessage={setSendMessage}
                    receiveMessage={receiveMessage}
                />
            </div>
        </div>
    );
};

export default Chat;
