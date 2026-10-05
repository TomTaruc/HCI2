/**
 * EGovAIScreen — Chatbot assistant for FAQs and navigation
 * Pure rule-based responses — no real AI API calls
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Trash2, Key, Settings } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useServices } from '../../state/ServiceContext';
import { db } from '../../mock/db';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = [
  'How do I get an NBI Clearance?',
  'What is ePhilID?',
  'How do I verify my account?',
  'How do I use eTravel?',
  'Where can I pay SSS online?',
];

const INITIAL_MESSAGE: Message = { 
  id: 'init', 
  role: 'model', 
  text: 'Mabuhay! 👋 I\'m the eGov AI Assistant — your guide to Philippine government services. Ask me about ePhilID, NBI Clearance, SSS, PhilHealth, eTravel, and more!' 
};

// Provide context to the model about the app
const SYSTEM_PROMPT = `
You are the eGovPH AI Assistant, an official digital guide for the Philippine government's single operating system.
Your job is to assist citizens with navigating government services, understanding requirements, and finding relevant information.
Keep your answers concise, accurate, and helpful. Use markdown for formatting. 
Important: If the user asks about something unrelated to government services or the Philippines, politely decline to answer and guide them back to government topics.
`;

export function EGovAIScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const services = useServices();
  const state = location.state as { initialPrompt?: string } | null;
  
  const [apiKey, setApiKey] = useState(db.get<string>('gemini_api_key') || '');
  const [showSettings, setShowSettings] = useState(!db.get<string>('gemini_api_key'));

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = db.get<Message[]>('egov_chat_history');
    return saved && saved.length > 0 ? saved : [INITIAL_MESSAGE];
  });
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [initialSent, setInitialSent] = useState(false);

  // Save history
  useEffect(() => {
    db.set('egov_chat_history', messages);
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (state?.initialPrompt && !initialSent) {
      setInitialSent(true);
      // Remove it from history so refresh doesn't trigger it again
      navigate(location.pathname, { replace: true, state: {} });
      // Needs to be called directly because `send` uses `input` state if no arg
      send(state.initialPrompt);
    }
  }, [state?.initialPrompt, initialSent, navigate, location.pathname]);

  const send = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || !apiKey) return;
    setInput('');
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT
      });

      // Build chat history for context (excluding the very first placeholder if it's the only one)
      const history = updatedMessages
        .filter(m => m.id !== 'init' && m.id !== userMsg.id)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const chat = model.startChat({
        history,
        generationConfig: { maxOutputTokens: 500 }
      });

      // Context injection
      let contextMsg = msg;
      if (services.weather && msg.toLowerCase().includes('weather')) {
        contextMsg = `[Context: Current weather in Quezon City is ${services.weather.temp}°C, ${services.weather.condition}]\n\n${msg}`;
      }

      const result = await chat.sendMessage(contextMsg);
      const response = result.response.text();
      
      setMessages(m => [...m, { id: Date.now().toString(), role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      setMessages(m => [...m, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: 'Sorry, I encountered an error communicating with the AI service. Please check your API key.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Clear all chat history?')) {
      setMessages([INITIAL_MESSAGE]);
    }
  };

  const saveKey = (key: string) => {
    setApiKey(key);
    db.set('gemini_api_key', key);
    setShowSettings(false);
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AppBar title="eGov AI" showBack rightContent={
        <div className="flex gap-2 mr-2 text-primary">
          <button onClick={clearHistory} aria-label="Clear Chat"><Trash2 size={20} /></button>
          <button onClick={() => setShowSettings(!showSettings)} aria-label="Settings"><Settings size={20} /></button>
        </div>
      } />
      <div className="bp-stripe" aria-hidden="true" />

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-border p-4 shadow-sm z-10">
          <h3 className="text-body font-semibold flex items-center gap-2 text-text-primary mb-2">
            <Key size={16} /> API Settings
          </h3>
          <p className="text-body-sm text-text-secondary mb-3">
            Please provide your Google Gemini API key to enable AI features. Your key is stored locally in your browser.
          </p>
          <div className="flex gap-2">
            <input 
              type="password"
              placeholder="AIzaSy..."
              className="flex-1 border border-border rounded-lg px-3 py-2 text-body-sm focus:border-primary outline-none"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <button 
              onClick={() => saveKey(apiKey)}
              className="bg-primary text-white px-4 py-2 rounded-lg text-body-sm font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-bg">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={[
              'max-w-[80%] rounded-2xl px-4 py-3 text-body-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-sm'
                : 'bg-white border border-border text-text-primary rounded-tl-sm',
            ].join(' ')}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-1' : ''}>
                  {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
                    part.startsWith('**') && part.endsWith('**') 
                      ? <strong key={j}>{part.slice(2, -2)}</strong> 
                      : part
                  )}
                </p>
              ))}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-2 h-2 bg-text-secondary rounded-full"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="px-4 py-2 bg-white border-t border-border overflow-x-auto hide-scrollbar">
        <div className="flex gap-2">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about government services…"
          className="flex-1 h-11 px-4 bg-bg border border-border rounded-full text-body text-text-primary outline-none focus:border-primary"
          aria-label="Chat message input"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim()}
          className="w-11 h-11 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}
