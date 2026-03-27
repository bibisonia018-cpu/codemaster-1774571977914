import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';
import { ShieldAlert } from 'lucide-react';

// Connect to backend. In production, change this to your deployed backend URL.
const socket = io('http://localhost:5000');

function App() {
  const [inRoom, setInRoom] = useState(false);
  const [roomData, setRoomData] = useState({
    roomId: '',
    username: '',
    secretKey: ''
  });

  const handleJoin = (data) => {
    setRoomData(data);
    socket.emit('join_room', data.roomId);
    setInRoom(true);
  };

  const handleLeave = () => {
    setInRoom(false);
    setRoomData({ roomId: '', username: '', secretKey: '' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center flex flex-col items-center">
        <ShieldAlert size={48} className="text-primary mb-2" />
        <h1 className="text-3xl font-bold text-white tracking-wide">الدردشة السرية</h1>
        <p className="text-gray-400 text-sm mt-2">تشفير تام (E2EE) • لا سجلات • أمان مطلق</p>
      </header>

      <main className="w-full max-w-md bg-dark rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
        {!inRoom ? (
          <JoinRoom onJoin={handleJoin} />
        ) : (
          <ChatRoom socket={socket} roomData={roomData} onLeave={handleLeave} />
        )}
      </main>
      
      <footer className="mt-8 text-gray-600 text-xs">
        Powered by CodeMaster AI Architecture
      </footer>
    </div>
  );
}

export default App;