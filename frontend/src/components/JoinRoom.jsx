import React, { useState } from 'react';
import { Key, Users, User } from 'lucide-react';

const JoinRoom = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId && username && secretKey) {
      onJoin({ roomId, username, secretKey });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-200">الدخول لغرفة آمنة</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">اسم المستخدم</label>
          <div className="relative">
            <User className="absolute right-3 top-3 text-gray-500" size={18} />
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-darker border border-gray-700 rounded-lg py-2 pr-10 pl-4 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="الاسم المستعار..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">معرف الغرفة (Room ID)</label>
          <div className="relative">
            <Users className="absolute right-3 top-3 text-gray-500" size={18} />
            <input 
              type="text" 
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-darker border border-gray-700 rounded-lg py-2 pr-10 pl-4 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="مثال: room123"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">مفتاح التشفير السري (للغرفة)</label>
          <div className="relative">
            <Key className="absolute right-3 top-3 text-gray-500" size={18} />
            <input 
              type="password" 
              required
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full bg-darker border border-gray-700 rounded-lg py-2 pr-10 pl-4 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="كلمة المرور لتشفير الرسائل..."
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            * هذا المفتاح لن يتم إرساله للخادم نهائياً. يجب أن يمتلك الطرف الآخر نفس المفتاح ليتمكن من قراءة رسائلك.
          </p>
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
        >
          دخول الغرفة بشكل آمن
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;