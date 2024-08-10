'use client';
import { useState, useEffect, useRef } from 'react';
import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import SyncLoader from "react-spinners/SyncLoader";
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import './page.css';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi I'm Charlie, your Virtual Friend. How can I assist you today?`,
    },
  ]);
  const [message, setMessage] = useState('');
  // const [user] = useAuthState(auth);
  const router = useRouter();
  const messagesEndRef = useRef(null);



  // useEffect(() => {
  //   if (!user ) {
  //     router.push('/log-in');
  //   }
  // }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const newMessage = message;
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: newMessage },
      { role: 'assistant', content: '' },
    ]);

    try {
      const res = await fetch('api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: newMessage }]),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      reader.read().then(function processText({ done, value }) {
        if (done) return;

        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });

        return reader.read().then(processText);
      });
    } catch (err) {
      console.error('Error inside sendMessage function', err);
    }
  };

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            Charlie - your virtual Friend / Assistant
          </div>
          {/* <button
            className="logout-button"
            onClick={() => {
              signOut(auth);
              if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
              }
            }}
          >
            LogOut
          </button> */}
        </div>

        <div className="scroll-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-box ${message.role === 'assistant' ? 'assistant' : ''}`}
            >
              <div className={`message ${message.role === 'assistant' ? 'assistant' : ''}`}>
                {message.content ? (
                  message.content
                ) : (
                  <SyncLoader
                    className='loader'
                    color="#D01257"
                    size={5}
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              backgroundColor: '#0F1021',
              borderRadius: '9px',
              fontSize: "larger",
              border: '1px solid #15162d',
              color: 'white',
              padding: '10px',
              outline: 'none',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              boxSizing: 'border-box',
              margin: "10px",
              height: "50px",
              width: "100%", // Adjust width as needed
            }}
          />
          <button onClick={sendMessage} >
            <SendTwoToneIcon sx={{ color: '#1E90FF' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
