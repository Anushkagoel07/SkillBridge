import React from 'react';
import { useApp } from '../state/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Award, 
  CheckCircle2, 
  Globe2,
  Sparkles,
  Building2
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { state } = useApp();
  const { opportunities, volunteers, applications } = state;

  // Live state metrics
  const liveActiveOpps = opportunities.filter((o) => o.status === 'Open' || o.status === 'In Progress').length;
  const liveAcceptedVolunteers = applications.filter((a) => a.status === 'Accepted').length;
  const liveTotalAppsAndInvites = applications.length;
  const liveCompletedTasks = opportunities.filter((o) => o.status === 'Completed').length;
  const liveTotalHours = volunteers.reduce((acc, v) => acc + v.hours, 0);

  // Status breakdown
  const openCount = opportunities.filter((o) => o.status === 'Open').length;
  const inProgressCount = opportunities.filter((o) => o.status === 'In Progress').length;
  const completedCount = opportunities.filter((o) => o.status === 'Completed').length;

  // City breakdown of volunteers
  const cityCounts: Record<string, number> = {};
  volunteers.forEach((v) => {
    cityCounts[v.location] = (cityCounts[v.location] || 0) + 1;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Social Impact & Intelligence Metrics
          </h1>
          <p className="text-xs text-slate-500">
            Real-time telemetry measuring non-profit hours mobilized and skill alignment accuracy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Telemetry Active
          </span>
        </div>
      </div>

      {/* Split Section 1: Live Demo Session Stats */}
      <div className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-teal-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Demo Runtime Statistics</h2>
              <p className="text-xs text-slate-500">Computed instantly from your current in-memory state</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            Live Demo Stats
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Active Causes</span>
            <p className="text-2xl font-black text-slate-900">{liveActiveOpps}</p>
            <p className="text-[10px] text-indigo-600 font-semibold">Open or In Progress</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Volunteers Matched</span>
            <p className="text-2xl font-black text-violet-700">{liveAcceptedVolunteers}</p>
            <p className="text-[10px] text-violet-600 font-semibold">Accepted engagements</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Total Pipeline</span>
            <p className="text-2xl font-black text-slate-900">{liveTotalAppsAndInvites}</p>
            <p className="text-[10px] text-slate-500 font-semibold">Applications + Invites</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Completed Missions</span>
            <p className="text-2xl font-black text-emerald-700">{liveCompletedTasks}</p>
            <p className="text-[10px] text-emerald-600 font-semibold">Delivered impact</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500">Volunteer Hours</span>
            <p className="text-2xl font-black text-indigo-950">{liveTotalHours} hrs</p>
            <p className="text-[10px] text-teal-600 font-semibold">Across all 8 talent</p>
          </div>
        </div>
      </div>

      {/* Visual Charts: Pure CSS / SVG (no heavy chart library) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cause Status Breakdown Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Opportunity Lifecycle Distribution</h3>
          <p className="text-xs text-slate-500">Current status of all {opportunities.length} NGO causes</p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Open for Applications
                </span>
                <span>{openCount} ({Math.round((openCount / opportunities.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(openCount / opportunities.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  In Progress (Volunteer Engaged)
                </span>
                <span>{inProgressCount} ({Math.round((inProgressCount / opportunities.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(inProgressCount / opportunities.length) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Completed & Verified
                </span>
                <span>{completedCount} ({Math.round((completedCount / (opportunities.length || 1)) * 100)}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / (opportunities.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Talent Distribution by Metro City */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Talent Distribution by Metro Hub</h3>
          <p className="text-xs text-slate-500">Geographic footprint of active volunteer network</p>

          <div className="space-y-3 pt-2">
            {Object.entries(cityCounts).map(([city, count]) => {
              const pct = Math.round((count / volunteers.length) * 100);
              return (
                <div key={city}>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700">
                    <span>{city}</span>
                    <span>{count} volunteers ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Split Section 2: Sample Baseline Stats (Explicitly labelled) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-950 space-y-6">
        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Aggregated Platform Benchmark Stats</h2>
            <p className="text-xs text-slate-400">Historical performance metrics across national cohorts</p>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800/60">
            Sample baseline stats
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-2xl font-black text-indigo-300">18.4 hrs</p>
            <p className="text-xs text-slate-400 font-medium">Avg Time to Top Match</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-teal-300">89.6%</p>
            <p className="text-xs text-slate-400 font-medium">NGO Offer Acceptance</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-violet-300">97.1%</p>
            <p className="text-xs text-slate-400 font-medium">Mission Completion Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-amber-300">4.9 / 5.0</p>
            <p className="text-xs text-slate-400 font-medium">NGO Satisfaction Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};
