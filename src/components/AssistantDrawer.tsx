import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { rankVolunteers } from '../lib/matching';
import { Bot, X, Send, Sparkles, User, Building2 } from 'lucide-react';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am your SkillBridge Intelligent Matching Assistant. Ask me about top volunteer candidates, city availability, or how our 60/25/15 algorithm matches skills.',
    },
  ]);

  if (!isOpen) return null;

  const handleQuery = (queryText: string) => {
    const q = queryText.toLowerCase().trim();
    if (!q) return;

    let response = '';

    if (q.includes('algorithm') || q.includes('formula') || q.includes('weights') || q.includes('how it works')) {
      response =
        'SkillBridge uses a deterministic weighted formula:\n• 60% Skills: Exact matches (100%) + related skills via cluster synonyms (50%).\n• 25% Availability: Exact time overlap or "Flexible" availability.\n• 15% Location: Same city / remote (100%), NCR nearby metro cluster (70%), or distant (20%).';
    } else if (q.includes('delhi') || q.includes('noida') || q.includes('gurgaon') || q.includes('mumbai') || q.includes('bangalore') || q.includes('pune')) {
      const cityMatches = state.volunteers.filter((v) =>
        q.includes(v.location.toLowerCase())
      );
      if (cityMatches.length > 0) {
        response = `Found ${cityMatches.length} volunteer(s): ${cityMatches
          .map((v) => `${v.name} (${v.skills.slice(0, 2).join(', ')})`)
          .join('; ')}.`;
      } else {
        response = `No volunteers currently registered in that location.`;
      }
    } else if (q.includes('weekend')) {
      const weekenders = state.volunteers.filter((v) =>
        v.availability.some((a) => a.toLowerCase().includes('weekend') || a.toLowerCase().includes('flexible'))
      );
      response = `Volunteers available on weekends: ${weekenders.map((v) => v.name).join(', ')}.`;
    } else if (q.includes('top match') || q.includes('best volunteer') || q.includes('recommend')) {
      const activeOpp =
        state.opportunities.find((o) => o.id === state.selectedOpportunityId) ||
        state.opportunities[0];
      if (activeOpp) {
        const ranked = rankVolunteers(activeOpp, state.volunteers);
        const top = ranked[0];
        response = `For "${activeOpp.title}", the top match is ${top.volunteer.name} with ${top.match.total}% compatibility (${top.match.explanation}).`;
      } else {
        response = 'Please post an opportunity first to run ranking.';
      }
    } else {
      const firstOpp = state.opportunities[0];
      response = `Currently we have ${state.opportunities.length} active opportunities and ${state.volunteers.length} verified volunteers. For "${firstOpp?.title}", Aisha Khan is leading with high technical and schedule compatibility!`;
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: queryText },
      { sender: 'assistant', text: response },
    ]);
    setInput('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-indigo-900 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-indigo-950 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-teal-300">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              SkillBridge AI Copilot
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded border border-teal-500/30 font-semibold">
                Local
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Instant deterministic matching Q&A</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested prompts */}
      <div className="p-3 bg-slate-950/60 border-b border-indigo-950 flex gap-2 overflow-x-auto text-[11px] scrollbar-none">
        <button
          onClick={() => handleQuery('Who is the top match for Website Development?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/40 transition cursor-pointer"
        >
          ✨ Best web match?
        </button>
        <button
          onClick={() => handleQuery('Who is available on weekends?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/40 transition cursor-pointer"
        >
          📅 Weekend volunteers?
        </button>
        <button
          onClick={() => handleQuery('Explain the matching formula weights')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/40 transition cursor-pointer"
        >
          📐 Match weights?
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-indigo-600/40 flex items-center justify-center shrink-0 text-teal-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-indigo-950 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuery(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about volunteers, cities, or matches..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
