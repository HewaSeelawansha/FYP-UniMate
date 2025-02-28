import React from 'react'
import useAuth from '../../../hooks/useAuth';
import useUser from '../../../hooks/useUser';
import useRoommateUsers from '../../../hooks/useRoommate';
import { TbSend2 } from 'react-icons/tb';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

const RoommateComponent = ({gender}) => {
    const {user} = useAuth();
    const [isUser, isUserLoading] = useUser();
    const [users, refetch] = useRoommateUsers();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const handleChat = async (sender, receiver) => {
        const chatData = {
          senderId: sender,
          receiverId: receiver,
        };
      
        try {
          // First, check if a chat already exists between the two users
          const existingChat = await axiosSecure.get(`/chat/find/${receiver}/${sender}`);
      
          // If a chat already exists, navigate to the chat page
          if (existingChat.data !== null) {
            navigate(`/chats`);
            return;
          }
      
          // If no chat exists, create a new one
          const response = await axiosSecure.post(`/chat`, chatData);
      
          if (response.data) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Chat Created Successfully',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate(`/chats`);
          }
        } catch (error) {
          console.error('Error creating or fetching chat:', error);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Update Failed',
            text: 'An error occurred while processing the chat request.',
            showConfirmButton: true,
          });
        }
    };
    
  return (
    <div>
        {user ? (
            isUser ? (
              users && users?.length > 0 ? (
                users.map((roommate, index) => (
                  <div key={index}  className="mb-2">
                    <details className="collapse bg-black text-blue-500 hover:bg-blue-500 hover:text-black group" key={index}>
                    <summary className="collapse-title text-xl font-medium">
                      <div className="flex flex-row">
                        <div className="avatar px-2">
                          <div className="ring-primary group-hover:ring-black ring-offset-base-100 w-12 rounded-full ring ring-offset-2">
                            <img src={roommate?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'} alt="User Avatar" />
                          </div>
                        </div>
                        <p className="font-bold m-auto">
                          {roommate?.name}
                        </p>
                      </div>
                    </summary>
                    <div className="collapse-content flex flex-row gap-2">
                      <button
                        onClick={() => handleChat(user.email,roommate.email)}
                        className="w-full font-bold bg-white text-black py-2 rounded-lg hover:bg-black hover:text-white transition duration-300 flex items-center justify-center gap-2"
                      >
                        Direct Chat <TbSend2 className="text-xl" />
                      </button>
                    </div>
                  </details>
                  </div>
                ))
              ) : (
                <div className="bg-gray-200 rounded-lg">
                <div className="p-4">
                  <p className="font-bold">
                    No students are currently looking for a 
                    <span className="text-green"> roommate </span>
                    in listings for {gender}.
                  </p>
                </div>
              </div>
              )
            ) : (
              <div className="bg-gray-200 rounded-lg">
                <div className="p-4">
                  <p className="font-bold">
                    Only students can access the
                    <span className="text-green"> direct chat </span>with peers who are
                    looking for a roommate.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="bg-gray-200 rounded-lg">
              <div className="p-4">
                <p className="font-bold">
                  Please<span className="text-green"> login </span>to direct chat with
                  peers who are looking for a roommate.
                </p>
              </div>
            </div>
          )}
    </div>
  )
}

export default RoommateComponent