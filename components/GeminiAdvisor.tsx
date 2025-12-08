import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { getSafetyAdvice } from '../services/geminiService';

const GeminiAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    const result = await getSafetyAdvice('General Safety', query);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <Sparkles size={20} />
          <span className="font-semibold">Safety Advisor</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <h3 className="font-bold">AI Safety Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">
              <X size={18} />
            </button>
          </div>

          <div className="p-4 h-64 overflow-y-auto bg-gray-50 text-sm">
            {response ? (
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-gray-800">
                <p className="font-medium text-blue-600 mb-1">Advisor:</p>
                {response}
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-10">
                <p>Ask about RAC protocols, PPE requirements, or general safety guidelines.</p>
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
                placeholder="Ask about safety..."
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
      )}
    </div>
  );
};

export default GeminiAdvisor;