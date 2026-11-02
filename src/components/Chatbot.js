import React, { useState } from 'react';
import API from '../api';
import './Chatbot.css';
import { Bot, Send, Sparkles, X, MessageSquare, ChevronRight } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "👋 Hello! I am your NexaVentory AI Business Manager powered by Google Gemini. Ask me anything about your sales, profit margins, or inventory health!",
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "What is our net profit?",
    "Which products are low on stock?",
    "Show top selling products"
  ];

  const handleSendText = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMessage = { text: text, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/ai/chat', { message: text });
      setMessages((prev) => [...prev, { text: data.reply, sender: 'ai' }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I couldn't reach the AI intelligence engine right now. Please check server status.", sender: 'ai' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSendText(input);
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="bot-avatar-badge">
                <Bot size={18} />
              </div>
              <div className="bot-header-info">
                <h4>AI Virtual Manager</h4>
                <div className="bot-online-pill">
                  <span className="online-dot" />
                  <span>Gemini NLP Connected</span>
                </div>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)} title="Close Chat">
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="chatbot-quick-prompts">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className="quick-prompt-chip"
                onClick={() => handleSendText(q)}
                disabled={loading}
              >
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.sender}`}>
                {msg.sender === 'ai' && (
                  <div className="ai-bubble-tag">
                    <Sparkles size={11} /> AI
                  </div>
                )}
                <div className="bubble-text">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message-bubble ai loading-bubble">
                <span className="dot-pulse" />
                <span className="dot-pulse" />
                <span className="dot-pulse" />
              </div>
            )}
          </div>

          {/* Input Box */}
          <form className="chatbot-input" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Ask about revenue, low stock..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} title="Send Message">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)} title="Open AI Assistant">
        {isOpen ? (
          <X size={20} />
        ) : (
          <>
            <div className="toggle-icon-wrap">
              <Sparkles size={18} />
            </div>
            <span className="toggle-label">Ask AI Manager</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
