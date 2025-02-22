import React, { useEffect, useState } from "react";

const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const email = data?.members?.find((email) => email !== currentUser);

    // Check if the conversation is with the current user
    if (email === undefined) {
      setIsCurrentUser(true);
    }

    const getUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/${email || currentUser}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const user = await response.json();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUserData();
  }, [data, currentUser]);

  return (
    <>
      <div className="follower conversation flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-200 cursor-pointer">
        <div className="relative">
          {online || isCurrentUser && <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>}
          <img
            src={userData?.photoURL || "https://i.ibb.co/tPJnyqL1/btmn.jpg"}
            alt="Profile"
            className="min-w-12 w-12 h-12 min-h-12 rounded-full object-cover border-2 border-gray-300"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {userData?.name} {isCurrentUser && "(Yourself)"}
          </span>
          <span className={`text-sm ${online || isCurrentUser ? "text-emerald-500" : "text-gray-500"}`}>
            {online || isCurrentUser ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      <hr className="border-t border-gray-300 my-2" />
    </>
  );
};

export default Conversation;