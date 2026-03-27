import React, { useState, useEffect, useRef } from 'react';
import { Send, LogOut, Lock } from 'lucide-react';
import { encryptMessage, decryptMessage } from '../utils/crypto';

const ChatRoom = ({ socket, roomData, onLeave }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const chatBodyRef = useRef(null);

  const { roomId, username, secretKey } = roomData;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage !== '') {
      // 1. Encrypt the message
      const encryptedText = encryptMessage(currentMessage, secretKey);
      
      const messageData = {
        roomId: roomId,
        sender: username,
        encryptedText: encryptedText,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes().toString().padStart(2, '0')
      };

      // 2. Send to server
      await socket.emit('send_message', messageData);

      // 3. Add to local UI (Decrypted state)
      setMessageList((list) => [...list, { ...messageData, text: currentMessage, isMine: true }]);
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    const handleReceiveMsg = (data) => {
      // Decrypt incoming message
      const decryptedText = decryptMessage(data.encryptedText, secretKey);
      
      setMessageList((list) => [
        ...list, 
        { ...data, text: decryptedText, isMine: false }
      ]);
    };

    socket.on('receive_message', handleReceiveMsg);

    // Cleanup listener on unmount
    return () => {
      socket.off('receive_message', handleReceiveMsg);
    };
  }, [socket, secretKey]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh]">
      {/* Header */}
      <div className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Lock size={16} className="text-primary"/> 
            غرفة: {roomId}
          </h3>
          <p className="text-xs text-primary mt-1">مشفرة بالكامل (E2EE)</p>
        </div>
        <button 
          onClick={onLeave}
          className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-darker rounded-lg"
          title="مغادرة وحذف السجل"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-darker" ref={chatBodyRef}>
        {messageList.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-10">
            أنت الآن في بيئة آمنة.<br/>الرسائل لا تحفظ في أي مكان.
          </div>
        )}
        {messageList.map((msg, index) => (
          <div 
            key={index} 
            className={`flex flex-col ${msg.isMine ? 'items-start' : 'items-end'}`}
          >
            <span className="text-xs text-gray-500 mb-1 mx-1">{msg.sender}</span>
            <div 
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                msg.isMine 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-gray-800 text-gray-200 rounded-tl-none'
              }`}
              dir="auto"
            >
              <p className="break-words">{msg.text}</p>
            </div>
            <span className="text-[10px] text-gray-600 mt-1 mx-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Footer / Input */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder="اكتب رسالة سرية..."
            className="flex-1 bg-darker border border-gray-700 rounded-full py-2 px-4 text-white focus:outline-none focus:border-primary transition-colors"
            autoComplete="off"
          />
          <button 
            type="submit"
            className="bg-primary hover:bg-emerald-600 text-white rounded-full p-3 transition-colors flex items-center justify-center"
            disabled={!currentMessage.trim()}
          >
            <Send size={18} className="rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;