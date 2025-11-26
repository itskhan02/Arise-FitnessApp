import React from 'react';
import { UserIcon } from '../icons/UserIcon';
import { BotIcon } from '../icons/BotIcon';

const ChatMessage = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-4 my-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-cyan-500">
          <BotIcon className="w-6 h-6 text-white" />
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-lg max-w-lg whitespace-pre-wrap ${
          isModel ? 'bg-gray-800 text-left' : 'bg-blue-600 text-right'
        }`}
      >
        {message.text}
      </div>
      {!isModel && (
         <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-600">
           <UserIcon className="w-6 h-6 text-white" />
         </div>
      )}
    </div>
  );
};

export default ChatMessage;
