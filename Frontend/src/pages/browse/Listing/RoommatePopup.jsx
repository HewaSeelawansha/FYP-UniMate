import React from 'react';
import { FaUserFriends } from 'react-icons/fa';
import { Tabs } from 'flowbite-react';
import RoommateComponent from './RoommateComponent'; 

const RoommatePopup = ({ onClose, gender }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaUserFriends className="text-green-500" />
            Find a Roommate
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <Tabs.Group>
            <Tabs.Item active title={`Find Roommates (${gender})`}>
              <div className="p-4">
                <RoommateComponent gender={gender} />
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </div>
  );
};

export default RoommatePopup;