import React from 'react';
import { Job, JobMatchResult } from '../jobTypes';
import { useJobs } from '../state/JobContext';
import { JobScoreBreakdown } from './JobScoreBreakdown';
import { 
  X, 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  Bookmark, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  Briefcase,
  DollarSign,
  Info
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job;
  match: JobMatchResult;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, match, onClose }) => {
  const { jobState, jobDispatch } = useJobs();
  const isSaved = jobState.savedJobIds.includes(job.id);
  const isApplied = jobState.jobApplications.some((a) => a.jobId === job.id);

  // Check if deadline is within 7 days
  const daysUntilDeadline = Math.ceil(
    (new Date(job.deadline).getTime() - Date.now()) / (1000 * 3600 * 24)
  );
  const isUrgentDeadline = daysUntilDeadline <= 7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-700 to-violet-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                  {job.company}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {job.type}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  {job.workMode}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">{job.title}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-800">{job.salaryRange}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Listings Notice */}
        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[11px] flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo listings — fictional companies, not real vacancies.</span>
        </div>

        {/* Deadline Alert if near */}
        {isUrgentDeadline && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">
              Application deadline approaching: closes in {daysUntilDeadline} days ({job.deadline}).
            </span>
          </div>
        )}

        {/* Score Breakdown Component */}
        <JobScoreBreakdown match={match} />

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            About the Role
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Responsibilities */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Key Responsibilities
          </h3>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            {job.responsibilities.map((r, i) => (
              <li key={i} className="leading-relaxed">
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Required & Preferred Skills */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1.5">
              Required Skills Targets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map((s, i) => {
                const isMatched = match.matchedRequired.includes(s);
                return (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      isMatched
                        ? 'bg-teal-50 text-teal-800 border-teal-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {s} {isMatched && '✓'}
                  </span>
                );
              })}
            </div>
          </div>

          {job.preferredSkills.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Preferred Bonus Skills:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.preferredSkills.map((s, i) => {
                  const isMatched = match.matchedPreferred.includes(s);
                  return (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        isMatched
                          ? 'bg-violet-50 text-violet-800 border-violet-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {s} {isMatched && '✓'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => jobDispatch({ type: 'TOGGLE_SAVE_JOB', payload: job.id })}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
              isSaved
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
            <span>{isSaved ? 'Saved to Bookmarks' : 'Save Job'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Close
            </button>

            {isApplied ? (
              <button
                disabled
                className="px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold cursor-not-allowed flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Application Submitted</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  jobDispatch({ type: 'APPLY_JOB', payload: job.id });
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md flex items-center gap-2 cursor-pointer transition transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
