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
          const existingChat = await axiosSecure.get(`/chat/find/${receiver}/${sender}`);
          if (existingChat.data !== null) {
            navigate(`/chats?chatId=${existingChat.data._id}`);
            return;
          }
      
          const response = await axiosSecure.post(`/chat`, chatData);
          if (response.data) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Chat Created Successfully',
              showConfirmButton: false,
              timer: 1500,
            });
            navigate(`/chats?chatId=${response.data._id}`);
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
    <div className="space-y-6">
        {user ? (
            isUser ? (
              users && users?.length > 0 ? (
                <div className="grid gap-4">
                  {users.map((roommate, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border-l-4 border-green-500">
                      <div className="p-4 md:p-6 flex items-center">
                        <div className="flex-shrink-0 mr-4 relative">
                          <img 
                            src={roommate?.photoURL || 'https://i.ibb.co/nNWV4psx/1x76aqpar8181.webp'} 
                            alt="User Avatar" 
                            className="w-14 h-14 rounded-full object-cover border-4 border-green-100"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-900">{roommate?.name}</h3>
                          <p className="text-gray-600 text-sm">Looking for roommate</p>
                        </div>
                        <button
                          onClick={() => handleChat(user.email, roommate.email)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full shadow-sm transition-colors flex items-center"
                        >
                          <TbSend2 className="mr-2" />
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    No {gender} students currently looking for roommates
                  </h3>
                  <p className="text-green-800">
                    Check back later.
                  </p>
                </div>
              )
            ) : (
              <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Student Access Required</h3>
                <p className="text-green-800 mb-4">
                  Only students can chat with peers looking for roommates.
                </p>
              </div>
            )
          ) : (
            <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
              <p className="text-green-800 mb-4">
                Sign in to connect with students looking for roommates.
              </p>
            </div>
          )}
    </div>
  )
}

export default RoommateComponent