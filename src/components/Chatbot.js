import React, { useState } from 'react';
import API from '../api';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your NexaVentory AI Assistant. Ask me anything about your business!", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/ai/chat', { message: userMessage.text });
      setMessages((prev) => [...prev, { text: data.reply, sender: 'ai' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Sorry, I couldn't connect to the server right now.", sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>🤖 AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="message ai">Thinking...</div>}
          </div>
          <form className="chatbot-input" onSubmit={sendMessage}>
            <input 
              type="text" 
              placeholder="Ask about sales, stock..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close AI' : '💬 Ask AI'}
      </button>
    </div>
  );
};

export default Chatbot;
