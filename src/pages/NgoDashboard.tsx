import React from 'react';
import { useApp } from '../state/AppContext';
import { 
  Building2, 
  PlusCircle, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const { opportunities, applications, volunteers } = state;

  const totalPosted = opportunities.length;
  const totalAppsAndInvites = applications.length;
  const activeTasks = opportunities.filter((o) => o.status === 'In Progress').length;
  const completedTasks = opportunities.filter((o) => o.status === 'Completed').length;
  
  // Total hours from all accepted/completed volunteer work in opportunities
  const totalMobilizedHours = volunteers.reduce((acc, v) => acc + v.hours, 0);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Guided Hint Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-violet-950 text-white border border-indigo-800 shadow-md flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-400/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">NGO Coordinator Mission Center</h3>
            <p className="text-xs text-indigo-200">
              Select any opportunity below to inspect the AI match scores or post a brand new cause.
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'post-opportunity' })}
          className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Opportunity</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Posted Causes</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalPosted}</p>
          <p className="text-[11px] text-slate-500">Across Delhi NCR & Remote</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Candidates</span>
            <Users className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalAppsAndInvites}</p>
          <p className="text-[11px] text-slate-500">Applied & Invited combined</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">In Progress Tasks</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{activeTasks}</p>
          <p className="text-[11px] text-teal-600 font-medium">Volunteers actively working</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Volunteer Hours</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalMobilizedHours} hrs</p>
          <p className="text-[11px] text-emerald-600 font-medium">{completedTasks} completed missions</p>
        </div>
      </div>

      {/* Main Opportunities List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Active Opportunities</h2>
            <p className="text-xs text-slate-500">
              Manage opportunities, inspect ranked applicants, and dispatch invites.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {opportunities.length} Total
          </span>
        </div>

        {opportunities.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No opportunities posted yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first volunteer request with required skills to let the AI find matching candidates.
            </p>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'post-opportunity' })}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
            >
              Post First Opportunity
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {opportunities.map((opp) => {
              const oppApps = applications.filter((a) => a.opportunityId === opp.id);
              const acceptedCount = oppApps.filter((a) => a.status === 'Accepted').length;
              const pendingCount = oppApps.filter((a) => a.status === 'Pending').length;
              const invitedCount = oppApps.filter((a) => a.status === 'Invited').length;

              return (
                <div key={opp.id} className="p-5 hover:bg-slate-50/60 transition space-y-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition">
                          {opp.title}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(opp.status)}`}>
                          {opp.status}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getUrgencyBadge(opp.urgency)}`}>
                          {opp.urgency} Urgency
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{opp.description}</p>
                    </div>

                    <button
                      onClick={() => dispatch({ type: 'SELECT_OPPORTUNITY', payload: opp.id })}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      <span>View AI Matches</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Skills tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {opp.requiredSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Meta strip */}
                  <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {opp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {opp.timeCommitment}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Due {opp.deadline}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-slate-700">{oppApps.length} Engaged:</span>
                      {acceptedCount > 0 && (
                        <span className="text-emerald-700 font-semibold">{acceptedCount} Accepted</span>
                      )}
                      {invitedCount > 0 && (
                        <span className="text-violet-700 font-semibold">{invitedCount} Invited</span>
                      )}
                      {pendingCount > 0 && (
                        <span className="text-amber-700 font-semibold">{pendingCount} Applied</span>
                      )}
                      {oppApps.length === 0 && <span className="text-slate-400">0 applicants yet</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Recent Engagement Activity</h3>
        <div className="space-y-2.5">
          {applications.slice(0, 5).map((app) => {
            const opp = opportunities.find((o) => o.id === app.opportunityId);
            const vol = volunteers.find((v) => v.id === app.volunteerId);

            return (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                    {vol?.name.slice(0, 2).toUpperCase() || 'VO'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">{vol?.name}</span>{' '}
                    <span className="text-slate-500">
                      {app.type === 'invited' ? 'was invited for' : 'applied to'}
                    </span>{' '}
                    <span className="font-medium text-indigo-600">{opp?.title}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.status === 'Invited'
                      ? 'bg-violet-100 text-violet-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
