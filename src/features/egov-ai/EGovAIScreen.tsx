/**
 * EGovAIScreen — Chatbot assistant for FAQs and navigation
 * Pure rule-based responses — no real AI API calls
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import { AppBar } from '../../components/layout/AppBar';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTIONS = [
  'How do I get an NBI Clearance?',
  'What is ePhilID?',
  'How do I verify my account?',
  'How do I use eTravel?',
  'Where can I pay SSS online?',
];

const RULES: [RegExp, string | (() => string)][] = [
  [/nbi/i, 'To get an **NBI Clearance**, go to Services → BPESH → Book Appointment → NBI Clearance. You can choose a date and time slot. Bring a valid ID on the day. Processing takes 1–3 business days.'],
  [/ephilid|national id|digital id/i, 'Your **ePhilID** (Digital National ID) is issued by PhilSys (PSA). To view it, your account must be verified. Go to Mobile ID → ePhilID. It shows your full details and a shareable QR code.'],
  [/verif/i, 'To **verify your account**, go to Menu → Account → Verify Account. You will need your personal information and your PhilSys Card Number (PCN). The process takes about 5 minutes and includes a quick liveness check.'],
  [/etravel|travel/i, '**eTravel** is the official electronic travel declaration for all international travelers to/from the Philippines. Go to Services → eTravel, select Inbound or Outbound, and complete the form. No account required.'],
  [/sss|social security/i, 'You can link your **SSS** account in Agencies → SSS. Once linked, you can view your contribution records, loan balance, and maternity/sickness benefit status.'],
  [/philhealth/i, 'Link your **PhilHealth** account in Agencies → PhilHealth. You can check your premium payments, MDR, and coverage status.'],
  [/pagibig|pag-ibig|hdmf/i, '**Pag-IBIG Fund** (HDMF) lets you view your savings and loan accounts. Go to Agencies → Pag-IBIG to link your membership.'],
  [/mpin|pin/i, 'Your **MPIN** is a 6-digit code you create during registration. If you forgot it, go to Log In → Forgot MPIN. You will verify via OTP and then set a new MPIN.'],
  [/psa|birth cert/i, 'You can request **PSA documents** (birth, marriage, death certificate) through BPESH → PSA Documents. Delivery options include pickup at a PSA office or mail delivery.'],
  [/egovpay|pay/i, '**eGovPay** lets you pay government fees like SSS contributions, PhilHealth premiums, BIR taxes, and passport fees. Go to Services → eGovPay and select the payment item.'],
  [/hello|hi|mabuhay/i, 'Mabuhay! 👋 I\'m the eGov AI Assistant. I can help you navigate eGovPH services, find information, and answer common questions about government transactions. What can I help you with?'],
  [/help|what can you do/i, 'I can help you with:\n• Navigating eGovPH services\n• Understanding government requirements\n• Finding appointment and payment options\n• Explaining your Digital ID wallet\n\nJust ask me anything!'],
];

function getResponse(input: string): string {
  for (const [pattern, response] of RULES) {
    if (pattern.test(input)) {
      return typeof response === 'function' ? response() : response;
    }
  }
  return "I'm not sure about that specific query. For accurate information, please contact the relevant government agency directly. You can also try searching for the service using the Search button on the Home screen, or use the Consultation form to send a query to an agency.";
}

let msgId = 0;

export function EGovAIScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: msgId++, role: 'assistant', text: 'Mabuhay! 👋 I\'m the eGov AI Assistant — your guide to Philippine government services. Ask me about ePhilID, NBI Clearance, SSS, PhilHealth, eTravel, and more!' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    setInput('');
    const userMsg: Message = { id: msgId++, role: 'user', text: msg };
    setMessages(m => [...m, userMsg]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
    const response = getResponse(msg);
    setIsTyping(false);
    setMessages(m => [...m, { id: msgId++, role: 'assistant', text: response }]);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppBar title="eGov AI" showBack />
      <div className="bp-stripe" aria-hidden="true" />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-bg">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
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
