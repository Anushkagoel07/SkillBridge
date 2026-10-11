import React from 'react';
import { useApp } from '../state/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Target, 
  Clock, 
  Globe2, 
  HeartHandshake,
  ShieldCheck,
  Zap,
  TrendingUp,
  Building,
  Briefcase,
  Upload
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { dispatch } = useApp();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-indigo-900/50 shadow-2xl">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-teal-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Social Innovation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            SkillBridge —{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-indigo-200 to-violet-300">
              AI Volunteer Matcher
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-300 font-medium">
            "The Right Skills. The Right Cause. Real Impact."
          </p>

          <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
            Non-profits struggle with mismatched volunteer skillsets, uncertain availability, and geographical constraints. SkillBridge bridges that gap with transparent, multi-dimensional AI scoring that connects verified talent to grassroots causes in seconds.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => {
                dispatch({ type: 'SET_ROLE', payload: 'volunteer' });
                dispatch({ type: 'SET_VIEW', payload: 'marketplace' });
              }}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'SET_ROLE', payload: 'ngo' });
                dispatch({ type: 'SET_VIEW', payload: 'ngo-dashboard' });
              }}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Building className="w-4 h-4" />
              <span>Find Volunteers (NGO)</span>
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'SET_ROLE', payload: 'volunteer' });
                dispatch({ type: 'SET_VIEW', payload: 'find-jobs' });
              }}
              className="px-5 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-teal-300" />
              <span>Find Jobs</span>
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'SET_ROLE', payload: 'volunteer' });
                dispatch({ type: 'SET_VIEW', payload: 'upload-resume' });
              }}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/90 hover:bg-slate-700 text-teal-300 border border-teal-500/30 transition cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resume</span>
            </button>

            <button
              onClick={() => {
                dispatch({ type: 'SET_ROLE', payload: 'ngo' });
                dispatch({ type: 'SET_VIEW', payload: 'ngo-dashboard' });
              }}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Launch Guided Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Impact Stat Counters (Sample baseline) */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Platform Social Footprint
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
            * Sample demo data
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-indigo-950">4,280+</p>
            <p className="text-xs font-medium text-slate-500">Verified Volunteer Hours</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-violet-700">85+</p>
            <p className="text-xs font-medium text-slate-500">NGOs & Community Causes</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-teal-600">94.2%</p>
            <p className="text-xs font-medium text-slate-500">Skill Alignment Accuracy</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-slate-800">18</p>
            <p className="text-xs font-medium text-slate-500">Metro Hubs & Remote Links</p>
          </div>
        </div>
      </section>

      {/* The Problem & Solution Breakdown */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Solving the Non-Profit Talent Disconnect
          </h2>
          <p className="text-sm text-slate-600">
            Why traditional volunteer message boards fail both organizations and willing helpers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">The NGO Dilemma</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Grassroots NGOs spend dozens of hours sifting through random signups only to discover volunteers lack critical tools like React, accounting, or weekend time slots.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">The Volunteer Dilemma</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Skilled professionals want to donate high-value technical abilities but get relegated to generic tasks that do not move the needle or fit their tight calendar.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-indigo-200/80 bg-gradient-to-b from-indigo-50/50 to-white shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">The SkillBridge Fix</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              An intelligent, transparent matching engine weighing Skills (60%), Availability (25%), and Location (15%) to recommend the perfect fit instantly.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-indigo-950">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Intelligent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">How SkillBridge Operates</h2>
          <p className="text-sm text-slate-400">
            Zero friction, zero wasted coordination hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-teal-300 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="text-base font-bold text-white">Post Opportunity</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Specify technical skills, required time commitment, schedule windows, and geographic preferences.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="text-base font-bold text-white">AI Real-Time Ranking</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our algorithm computes exact and semantic skill overlap, schedule compatibility, and city distance with complete transparent explanations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/30 border border-teal-400/40 text-teal-300 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="text-base font-bold text-white">1-Click Dispatch & Impact</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Invite top matches with one click. Volunteers review match details, accept, and track their social contribution hours live.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
