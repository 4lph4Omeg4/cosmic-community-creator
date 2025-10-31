import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '../types';
import { getPoeticReflection } from '../services/geminiService';
import { XIcon } from './Icons';

interface ReflectiveIntelligenceProps {
  onClose: () => void;
}

const ReflectiveIntelligence: React.FC<ReflectiveIntelligenceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const modelResponseText = await getPoeticReflection(input);
    const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: modelResponseText };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-[90vw] max-w-2xl h-[80vh] bg-black/50 backdrop-blur-xl border border-purple-300/20 rounded-2xl shadow-2xl shadow-purple-900/50 flex flex-col"
    >
      <div className="flex-shrink-0 p-4 border-b border-purple-300/20 flex justify-between items-center">
        <h2 className="font-display text-2xl text-purple-200">The Oracle's Mirror</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-indigo-500/30 text-indigo-100' : 'bg-purple-500/20 text-purple-100'}`}>
                <p className="whitespace-pre-wrap font-light">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-2 rounded-xl bg-purple-500/20 text-purple-100">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="flex-shrink-0 p-4 border-t border-purple-300/20">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Whisper your query to the ether..."
            className="flex-grow bg-transparent border border-purple-300/30 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
          />
          <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 bg-purple-600/50 text-white rounded-full hover:bg-purple-600/80 disabled:opacity-50 transition-colors">
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReflectiveIntelligence;