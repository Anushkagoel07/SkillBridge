import React from 'react';
import { useApp } from '../state/AppContext';
import { rankVolunteers } from '../lib/matching';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { 
  Sparkles, 
  UserCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Check, 
  Send,
  Building2,
  Calendar,
  AlertCircle,
  Award
} from 'lucide-react';

export const OpportunityMatchesPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { opportunities, volunteers, applications, selectedOpportunityId } = state;

  const currentOpp =
    opportunities.find((o) => o.id === selectedOpportunityId) ||
    opportunities[0];

  if (!currentOpp) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">No opportunities available.</p>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'post-opportunity' })}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Create One Now
        </button>
      </div>
    );
  }

  // Live ranking computed on the fly
  const rankedResults = rankVolunteers(currentOpp, volunteers);

  // Applications for this specific opportunity
  const oppApplications = applications.filter((a) => a.opportunityId === currentOpp.id);

  const getAvatarGradient = (id: string) => {
    const charCode = id.charCodeAt(id.length - 1) || 0;
    if (charCode % 3 === 0) return 'from-indigo-600 to-violet-600';
    if (charCode % 3 === 1) return 'from-teal-500 to-emerald-600';
    return 'from-violet-600 to-rose-500';
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Selector & Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900">{currentOpp.title}</h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentOpp.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-slate-700">{currentOpp.ngoName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {currentOpp.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {currentOpp.timeCommitment}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Opportunity Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Switch Cause:</span>
            <select
              value={currentOpp.id}
              onChange={(e) => dispatch({ type: 'SELECT_OPPORTUNITY', payload: e.target.value })}
              className="bg-slate-50 text-xs font-semibold text-indigo-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Opportunity Specs */}
        <div className="flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
              Required Skill Targets
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentOpp.requiredSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-semibold text-xs border border-indigo-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <div>
              <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
                Work Schedule
              </span>
              <span className="font-semibold text-slate-800">
                {currentOpp.availability.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
                Volunteers Needed
              </span>
              <span className="font-semibold text-slate-800">{currentOpp.volunteersNeeded}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Algorithm Transparency Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-950/80 text-indigo-200 border border-indigo-800/60 text-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            AI-powered matching — local intelligent scoring demo (weighted: Skills 60% · Availability 25% · Location 15%)
          </span>
        </div>
        <span className="text-[11px] bg-teal-400/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-400/30">
          Ranked live ({rankedResults.length} candidates)
        </span>
      </div>

      {/* Existing Applicants & Engaged Volunteers Section */}
      {oppApplications.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Current Candidates & Engagement Status</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {oppApplications.length} Engaged
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {oppApplications.map((app) => {
              const volunteer = volunteers.find((v) => v.id === app.volunteerId);
              if (!volunteer) return null;

              return (
                <div
                  key={app.id}
                  className="py-3.5 flex items-center justify-between flex-wrap gap-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                        volunteer.id
                      )} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                    >
                      {volunteer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{volunteer.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {app.type === 'applied' ? 'Applied directly' : 'Invited by NGO'} •{' '}
                        {volunteer.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        app.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Invited'
                          ? 'bg-violet-100 text-violet-800'
                          : app.status === 'Completed'
                          ? 'bg-teal-100 text-teal-800'
                          : app.status === 'Declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>

                    {/* Pending Application: NGO can Accept / Decline */}
                    {app.status === 'Pending' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            dispatch({ type: 'ACCEPT_APPLICATION', payload: app.id })
                          }
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() =>
                            dispatch({ type: 'DECLINE_APPLICATION', payload: app.id })
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Accepted Volunteer: NGO can Mark Work Completed */}
                    {app.status === 'Accepted' && (
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'MARK_WORK_COMPLETED',
                            payload: {
                              opportunityId: currentOpp.id,
                              volunteerId: volunteer.id,
                              applicationId: app.id,
                            },
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ranked Volunteers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Ranked Volunteer Candidates
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Sorted by total AI compatibility
          </span>
        </div>

        <div className="space-y-4">
          {rankedResults.map(({ volunteer, match }, idx) => {
            const existingApp = oppApplications.find((a) => a.volunteerId === volunteer.id);
            const isInvited = existingApp?.status === 'Invited';
            const isAccepted = existingApp?.status === 'Accepted';
            const isPending = existingApp?.status === 'Pending';
            const isCompleted = existingApp?.status === 'Completed';

            return (
              <div
                key={volunteer.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 hover:border-indigo-200 transition space-y-4"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Avatar & Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${getAvatarGradient(
                        volunteer.id
                      )} text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0`}
                    >
                      {volunteer.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{volunteer.name}</h3>
                        <span className="text-xs font-bold text-slate-400">#{idx + 1} Rank</span>
                      </div>
                      <p className="text-xs text-slate-500 max-w-xl">{volunteer.bio}</p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {volunteer.experience} • {volunteer.hours} verified hours • {volunteer.completedProjects} projects
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isInvited ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-violet-100 text-violet-700 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed opacity-80"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Invited</span>
                      </button>
                    ) : isAccepted ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accepted & Working</span>
                      </button>
                    ) : isPending ? (
                      <span className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                        Applied (Pending Decision)
                      </span>
                    ) : isCompleted ? (
                      <span className="text-xs font-semibold px-3 py-1.5 bg-teal-50 text-teal-700 rounded-xl border border-teal-200">
                        Work Completed
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'INVITE_VOLUNTEER',
                            payload: { opportunityId: currentOpp.id, volunteerId: volunteer.id },
                          })
                        }
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Invite Volunteer</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Score Breakdown Component with 3 bars and explanation */}
                <ScoreBreakdown match={match} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
