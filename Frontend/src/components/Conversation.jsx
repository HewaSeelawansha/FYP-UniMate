import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosSecure from '../hooks/useAxiosSecure'

const Conversation = ({ data, currentUser, online, isSelected }) => {
  const [userData, setUserData] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const email = data?.members?.find((email) => email !== currentUser);

    if (email === undefined) {
      setIsCurrentUser(true);
    }

    const getUserData = async () => {
      try {
        const response = await axiosSecure.get(`/users/${email || currentUser}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    // const getLastMessage = async () => {
    //   try {
    //     const response = await fetch(`http://localhost:3000/message/last/${data._id}`);
    //     if (response.ok) {
    //       const message = await response.json();
    //       setLastMessage(message?.text || "");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching last message:", error);
    //   }
    // };

    getUserData();
    // getLastMessage();
  }, [data, currentUser]);

  return (
    <div className={`transition-all rounded ${isSelected ? 'ring-1 ring-green-500/30' : ''}`}>
      <div className="flex items-center gap-3 p-3">
        <div className="relative">
          <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${online || isCurrentUser ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
          <img
            src={userData?.photoURL || "https://i.ibb.co/tPJnyqL1/btmn.jpg"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-800 truncate">
              {userData?.name} {isCurrentUser && "(You)"}
            </h4>
            <span className="text-xs text-gray-400">
              {lastMessage && "2h"} {/* Replace with actual time */}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {lastMessage || (isCurrentUser ? "Your conversation" : "Say hello!")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Conversation;