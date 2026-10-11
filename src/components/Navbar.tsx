import React from 'react';
import { useApp } from '../state/AppContext';
import { 
  Sparkles, 
  RotateCcw, 
  Building2, 
  User, 
  Bot,
  Layers,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAssistant }) => {
  const { state, dispatch } = useApp();
  const activeVolunteer = state.volunteers.find((v) => v.id === state.activeVolunteerId);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-indigo-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'landing' })}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-teal-400 p-0.5 shadow-lg shadow-indigo-900/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                SkillBridge
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Matcher
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              The Right Skills. The Right Cause. Real Impact.
            </p>
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-3">
          {/* Quick AI Assistant Trigger */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-950/60 hover:bg-violet-900/80 text-violet-200 border border-violet-800/50 transition-all cursor-pointer shadow-sm"
            title="Local Intelligent Match Assistant"
          >
            <Bot className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="hidden md:inline">AI Match Copilot</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-indigo-900/60 shadow-inner">
            <button
              onClick={() => dispatch({ type: 'SET_ROLE', payload: 'ngo' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                state.activeRole === 'ngo'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>NGO Coordinator</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_ROLE', payload: 'volunteer' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                state.activeRole === 'volunteer'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Volunteer</span>
            </button>
          </div>

          {/* Volunteer User Picker (Visible when Volunteer role is active) */}
          {state.activeRole === 'volunteer' && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-indigo-900/40">
              <span className="text-[11px] text-slate-400">Act as:</span>
              <select
                value={state.activeVolunteerId}
                onChange={(e) => dispatch({ type: 'SET_ACTIVE_VOLUNTEER', payload: e.target.value })}
                className="bg-slate-900 text-xs font-medium text-teal-300 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-teal-400 cursor-pointer"
              >
                {state.volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.location})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Demo Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all changes and restore original demo seed data (volunteers & jobs)?')) {
                dispatch({ type: 'RESET_DEMO' });
                try {
                  const jobEvent = new CustomEvent('skillbridge-reset-job-demo');
                  window.dispatchEvent(jobEvent);
                } catch {}
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition cursor-pointer"
            title="Restore original seed data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
