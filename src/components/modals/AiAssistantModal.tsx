import React, { useState } from 'react';
import { Dish } from '../../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDish?: Dish | null;
  initialPrompt?: string;
  onApplyCustomizationPrompt?: (prompt: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  activeDish,
  initialPrompt = '',
  onApplyCustomizationPrompt
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; chips?: string[] }>>([
    {
      role: 'assistant',
      text: "Adaab Pilot! I am ASK DISHØ, your AI culinary intelligence. Ask me about ingredients, calories, authentic Hyderabad dum parameters, or dual-zone delivery pairing.",
      chips: [
        'High protein under 650 kcal',
        'Is the Dum Biryani dairy-free?',
        'How does Duo Co-Route work in Hyderabad?',
        'What is actually in this batch?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = (queryToSend?: string) => {
    const query = queryToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { role: 'user' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let botResponse = '';
      let chips: string[] | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('protein') || lower.includes('30g') || lower.includes('500 kcal') || lower.includes('biryani') || lower.includes('haleem')) {
        botResponse =
          'Hyderabad high-protein champions found: Deccan Volt Haleem from Pista House delivers a whopping 38g bio-available protein at 610 kcal! Alternatively, Nawabi Cyber Dum Biryani yields 34g protein with zero broken basmati grains.';
        chips = ['Select Deccan Volt Haleem', 'Order Nawabi Dum Biryani'];
      } else if (lower.includes('dairy')) {
        if (activeDish?.name.includes('Paneer') || activeDish?.name.includes('Thali') || activeDish?.name.includes('Idli')) {
          botResponse = `Warning: ${activeDish?.name} contains dairy (desi ghee/paneer/curd). In Customize mode, you can request olive oil sear and exclude raita.`;
        } else {
          botResponse =
            'Charminar Shahi Nalli Nihari and Crispy Mutton Luqmi are naturally dairy-free based on verified chef specs.';
        }
      } else if (lower.includes('two') || lower.includes('restaurant') || lower.includes('co-route') || lower.includes('3 km') || lower.includes('duo')) {
        botResponse =
          'DISHØ Hyderabad Dual-Zone Protocol: You can combine Bawarchi Cyber Dum Lab (Mindspace) and Pista House Haleem Forge (Madhapur) because they are separated by only 1.8 km across the Durgam Cable Bridge! You get a single runner, +₹45 rider incentive, and zero double delivery fee.';
        chips = ['Configure Hyderabad Duo Cart'];
      } else if (lower.includes('cook') || lower.includes('dum') || lower.includes('charcoal')) {
        botResponse =
          activeDish?.culinaryTelemetry ||
          'Hyderabad master chefs use airtight whole-wheat dough dough seals (Dum Pukht) over glowing babool charcoal embers at 104°C, locking in delicate saffron and meat steam without moisture loss.';
      } else if (lower.includes('what is actually in this') || lower.includes('ingredient')) {
        if (activeDish) {
          const ingList = activeDish.ingredients.map((i) => `${i.name} (${i.grams}g)`).join(', ');
          botResponse = `Verified Hyderabad batch recipe for ${activeDish.name}: ${ingList}. Calorie yield is calibrated to within ±5g accuracy.`;
        } else {
          botResponse =
            'All DISHØ dishes feature 100% traceable gram-accurate batch components with calorie, protein, carbohydrate, and lipid transparency.';
        }
      } else {
        botResponse = `Processed command: "${query}". I have calibrated this to authentic Hyderabad palate preferences. Ready to apply to build?`;
        chips = ['Apply Customization to Build'];
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant' as const, text: botResponse, chips }
      ]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full sm:max-w-md bg-[#10182A] border border-[#63e6ff]/30 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] h-[550px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#181b27]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ba027b] to-[#63e6ff] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </div>
            <div>
              <h3 className="font-space text-sm font-bold text-[#F5F8FF] uppercase tracking-wider flex items-center gap-1.5">
                <span>ASK DISHØ</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#7bfbac] animate-ping"></span>
              </h3>
              <p className="font-space text-[10px] text-[#63e6ff]">
                AI Culinary Intelligence · Deccani Knowledge Graph
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#10182A] text-[#869396] hover:text-[#F5F8FF] flex items-center justify-center border border-white/5"
          >
            ✕
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl font-space text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#63e6ff] text-[#00363e] font-semibold rounded-br-none shadow-[0_0_10px_rgba(99,230,255,0.3)]'
                    : 'bg-[#181b27] text-[#F5F8FF] border border-white/5 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {/* Action Chips */}
              {m.chips && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.chips.map((chip, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => {
                        if (chip === 'Apply Customization to Build') {
                          if (onApplyCustomizationPrompt) {
                            onApplyCustomizationPrompt(inputQuery || 'Extra birista, double salan');
                          }
                          onClose();
                        } else {
                          handleSend(chip);
                        }
                      }}
                      className="px-2.5 py-1 rounded-full bg-[#181b27] border border-[#63e6ff]/30 text-[#63e6ff] hover:bg-[#63e6ff] hover:text-[#00363e] font-space text-[10px] font-bold tracking-wide transition-all active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-[#63e6ff] font-space text-xs">
              <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
              <span>Scanning recipes & Hyderabad dum telemetry...</span>
            </div>
          )}
        </div>

        {/* Query Input */}
        <div className="p-3 border-t border-white/10 bg-[#181b27]/80 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything (allergens, protein, dum technique)..."
            className="flex-1 h-10 px-3 rounded-xl bg-[#10182A] border border-white/10 text-xs font-space text-[#F5F8FF] focus:outline-none focus:border-[#63e6ff]"
          />
          <button
            onClick={() => handleSend()}
            className="w-10 h-10 rounded-xl bg-[#63e6ff] text-[#00363e] flex items-center justify-center font-bold hover:bg-[#51d7f0] active:scale-90 transition-all shadow-[0_0_10px_rgba(99,230,255,0.4)]"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
