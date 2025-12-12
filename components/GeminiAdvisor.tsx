
import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { getSafetyAdvice } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdvisor } from '../contexts/AdvisorContext';

// The Chat Window Component (Global)
const GeminiAdvisor: React.FC = () => {
  const { t, language } = useLanguage();
  const { isOpen, setIsOpen } = useAdvisor();
  
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    const result = await getSafetyAdvice('General Safety', query, language);
    setResponse(result);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 no-print animate-fade-in-up">
      <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h3 className="font-bold">{t.advisor.title}</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 h-64 overflow-y-auto bg-gray-50 text-sm">
          {response ? (
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-gray-800">
              <p className="font-medium text-blue-600 mb-1">{t.advisor.sender}:</p>
              {response}
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-10">
              <p>{t.advisor.emptyState}</p>
            </div>
          )}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        <div className="p-3 border-t bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder={t.advisor.placeholder}
              className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={handleAsk}
              disabled={loading}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// The Trigger Button Component (Local to Pages)
export const AdvisorTrigger: React.FC = () => {
    const { toggle, isOpen } = useAdvisor();
    return (
        <button 
            onClick={toggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm
                ${isOpen 
                    ? 'bg-indigo-600 text-white shadow-indigo-500/30' 
                    : 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-600'}
            `}
            title="Open AI Safety Advisor"
        >
            <Sparkles size={14} />
            <span>Advisor</span>
        </button>
    );
};

export default GeminiAdvisor;
