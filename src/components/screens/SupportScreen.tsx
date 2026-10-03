import React, { useState } from 'react';

interface SupportScreenProps {
  onBack: () => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Adaab Pilot! DISHØ Hyderabad Support Pod connected. How can we optimize your culinary telemetry today?',
      time: '19:10'
    }
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'Where is my Dum Biryani right now?',
    'Explain Durgam Cable Co-Route',
    'Smart Lock OTP not receiving',
    'Packaging heat seal issue'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let reply = 'Our Deccani Dispatch Coordinator has verified your mission. Courier is maintaining 42 km/h vector across Durgam Cheruvu bridge. ETA intact!';
      if (query.toLowerCase().includes('otp')) {
        reply = 'Your active handoff OTP is 4192. It is also displayed inside your Smart Handoff HUD.';
      } else if (query.toLowerCase().includes('co-route')) {
        reply = 'DUO-ZONE allows 1 courier to collect from 2 kitchens separated by under 3.0 km. You only pay 1 consolidated delivery fee!';
      }
      setMessages((prev) => [...prev, { sender: 'agent', text: reply, time: 'Just now' }]);
    }, 800);
  };

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 max-w-[480px] mx-auto w-full flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#10182A] border border-white/10 text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="text-center">
            <h2 className="text-base font-extrabold text-[#F5F8FF] font-space uppercase">
              CULINARY SUPPORT POD
            </h2>
            <p className="text-[10px] text-[#75f5a6] flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#75f5a6] animate-pulse" />
              24/7 DECCANI CONCIERGE ACTIVE
            </p>
          </div>
          <div className="w-9" />
        </div>

        {/* Message Thread */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#10182A]/80 border border-white/5 min-h-[340px] max-h-[420px] overflow-y-auto no-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[85%] text-xs font-space leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#63e6ff] text-black font-medium rounded-br-none'
                    : 'bg-[#060914] text-[#F5F8FF] border border-white/10 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-[#869396] font-space mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Chips */}
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-xl bg-[#10182A] border border-white/10 hover:border-[#63e6ff]/30 text-[10px] text-[#869396] hover:text-[#63e6ff] font-space transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="flex gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="TYPE QUERY FOR HYDERABAD DISPATCH CONCIERGE..."
          className="flex-1 bg-[#10182A] border border-white/10 rounded-2xl px-4 py-3 text-xs font-space text-[#F5F8FF] focus:outline-none focus:border-[#63e6ff]"
        />
        <button
          onClick={() => handleSend()}
          className="w-12 h-12 rounded-2xl bg-[#63e6ff] text-black flex items-center justify-center cursor-pointer hover:brightness-110 active:scale-95 transition-all flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </div>
    </div>
  );
};
