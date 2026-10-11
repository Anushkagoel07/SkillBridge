import React from 'react';
import { useApp } from '../state/AppContext';
import { useJobs } from '../state/JobContext';
import { matchJob } from '../lib/jobMatching';
import { 
  HeartHandshake, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Check, 
  ArrowRight, 
  Sparkles,
  Building2,
  Calendar,
  AlertCircle,
  Briefcase,
  Bookmark,
  FileCheck2,
  TrendingUp,
  Upload
} from 'lucide-react';

export const VolunteerDashboardPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { jobState } = useJobs();
  const { opportunities, applications, volunteers, activeVolunteerId } = state;
  const { jobs, candidateProfile, savedJobIds, jobApplications } = jobState;

  // Career computations
  const topJobMatch = React.useMemo(() => {
    let best = 0;
    jobs.forEach((j) => {
      const m = matchJob(candidateProfile, j);
      if (m.total > best) best = m.total;
    });
    return best;
  }, [jobs, candidateProfile]);

  // Profile completeness: name, email, education, location, skills >= 5
  const completeness = React.useMemo(() => {
    let score = 0;
    if (candidateProfile.name) score += 20;
    if (candidateProfile.email) score += 20;
    if (candidateProfile.education) score += 20;
    if (candidateProfile.location) score += 20;
    if (candidateProfile.skills.length >= 5) score += 20;
    return score;
  }, [candidateProfile]);

  const currentVolunteer =
    volunteers.find((v) => v.id === activeVolunteerId) || volunteers[0];

  const myApplications = applications.filter((a) => a.volunteerId === activeVolunteerId);
  const myInvitations = myApplications.filter(
    (a) => a.type === 'invited' && a.status === 'Invited'
  );
  const myActiveProjects = myApplications.filter((a) => a.status === 'Accepted');
  const myCompletedProjects = myApplications.filter((a) => a.status === 'Completed');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Invited':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'Completed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Declined':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Volunteer Summary Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
            {currentVolunteer?.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{currentVolunteer?.name}</h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Verified Contributor
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentVolunteer?.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {currentVolunteer?.availability.join(', ')}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50/80 rounded-xl text-center min-w-[90px] border border-indigo-100">
            <p className="text-lg font-black text-indigo-950">{currentVolunteer?.hours}</p>
            <p className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide">
              Logged Hours
            </p>
          </div>
          <div className="p-3 bg-violet-50/80 rounded-xl text-center min-w-[90px] border border-violet-100">
            <p className="text-lg font-black text-violet-950">
              {currentVolunteer?.completedProjects}
            </p>
            <p className="text-[10px] font-semibold text-violet-700 uppercase tracking-wide">
              Missions Done
            </p>
          </div>
        </div>
      </div>

      {/* Career & Job Matcher Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Career & Job Matcher Overview</h3>
              <p className="text-[11px] text-slate-500">Resume-matched internships & corporate employment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'find-jobs' })}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Explore {jobs.length} Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'upload-resume' })}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">Jobs Bookmarked</span>
            <p className="text-xl font-black text-slate-900">{savedJobIds.length}</p>
            <p className="text-[10px] text-indigo-600 font-medium">Saved for later</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">Applications Sent</span>
            <p className="text-xl font-black text-violet-700">{jobApplications.length}</p>
            <p className="text-[10px] text-violet-600 font-medium">In active pipeline</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">Top Match Compatibility</span>
            <p className="text-xl font-black text-emerald-700">{topJobMatch}%</p>
            <p className="text-[10px] text-emerald-600 font-medium">Based on your skills</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
              <span>Profile Completeness</span>
              <span className="font-bold text-slate-800">{completeness}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-2">
              <div
                className="bg-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">Add 5+ skills for 100%</p>
          </div>
        </div>
      </div>

      {/* Invitations Section (Crucial Demo Step!) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <h2 className="text-base font-bold text-slate-900">
              Direct Invitations from Non-Profits
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
            {myInvitations.length} Pending
          </span>
        </div>

        {myInvitations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-xs font-bold text-slate-700">No pending NGO invitations</h3>
            <p className="text-xs text-slate-400">
              You're all caught up! Explore the Cause Marketplace to apply directly.
            </p>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'marketplace' })}
              className="mt-2 px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-semibold cursor-pointer"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myInvitations.map((app) => {
              const opp = opportunities.find((o) => o.id === app.opportunityId);
              if (!opp) return null;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border-2 border-violet-200/80 shadow-md p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                        {opp.ngoName}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Direct NGO Invitation
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{opp.description}</p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {opp.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {opp.timeCommitment}
                      </span>
                    </div>
                  </div>

                  {/* Accept / Decline actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        dispatch({ type: 'DECLINE_APPLICATION', payload: app.id })
                      }
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() =>
                        dispatch({ type: 'ACCEPT_APPLICATION', payload: app.id })
                      }
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Invitation</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active In-Progress Missions */}
      {myActiveProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Active Commitments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myActiveProjects.map((app) => {
              const opp = opportunities.find((o) => o.id === app.opportunityId);
              if (!opp) return null;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{opp.ngoName}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      In Progress
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{opp.title}</h3>
                  <p className="text-xs text-slate-500">{opp.description}</p>
                  <div className="text-[11px] text-slate-400">
                    Schedule: {opp.availability.join(', ')} • {opp.timeCommitment}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete Application History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900">All Applications & History</h3>

        {myApplications.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            You haven't submitted any applications yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {myApplications.map((app) => {
              const opp = opportunities.find((o) => o.id === app.opportunityId);
              if (!opp) return null;

              return (
                <div
                  key={app.id}
                  className="py-3 flex items-center justify-between flex-wrap gap-2 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900">{opp.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      {opp.ngoName} • {opp.location} • Submitted on {app.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 capitalize">
                      {app.type === 'invited' ? 'NGO Invite' : 'Direct Application'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
