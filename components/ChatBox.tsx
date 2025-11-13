import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToChat } from '../services/geminiService';
import { SendIcon } from './Icons';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to my thinkery! Feel free to ask me anything about personal development, life skills, or my guides." }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToChat(userInput);
      setMessages([...newMessages, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages([...newMessages, { role: 'model', text: "I seem to be lost in thought... Could you ask that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[hsl(var(--surface))] p-8 rounded-xl shadow-lg border border-[hsl(var(--card-border))]">
      <h3 className="text-2xl font-bold mb-4">Chat with Father Dust</h3>
      <div className="bg-[hsl(var(--background))] h-96 rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto mb-4 border border-[hsl(var(--border))]">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg text-white ${
                msg.role === 'user'
                  ? 'bg-[hsl(var(--primary))]'
                  : 'bg-gray-700'
              }`}
            >
              <p className="text-sm" style={{whiteSpace: 'pre-wrap'}}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-sm p-3 rounded-lg bg-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question..."
          aria-label="Your message"
          className="flex-grow p-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--surface))] focus:ring-2 focus:ring-[hsl(var(--primary))] focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          aria-label="Send message"
          className="bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] px-5 py-3 rounded-lg font-semibold transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
