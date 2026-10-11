import React, { useState } from 'react';
import { useJobs } from '../state/JobContext';
import { useApp } from '../state/AppContext';
import { matchJob } from '../lib/jobMatching';
import { JobDetailModal } from '../components/JobDetailModal';
import { Job, JobApplicationStatus } from '../jobTypes';
import { 
  FileCheck2, 
  Bookmark, 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  Trash2, 
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';

export const MyJobApplicationsPage: React.FC = () => {
  const { jobState, jobDispatch } = useJobs();
  const { dispatch: appDispatch } = useApp();
  const { jobs, candidateProfile, jobApplications, savedJobIds } = jobState;

  const [activeTab, setActiveTab] = useState<'applied' | 'saved'>('applied');
  const [inspectingJob, setInspectingJob] = useState<Job | null>(null);

  const getStatusBadge = (status: JobApplicationStatus) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Under Review':
        return 'bg-violet-100 text-violet-800 border-violet-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getNextStatus = (current: JobApplicationStatus): JobApplicationStatus => {
    if (current === 'Applied') return 'Under Review';
    if (current === 'Under Review') return 'Shortlisted';
    return 'Applied';
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            My Job Applications & Bookmarks
          </h1>
          <p className="text-xs text-slate-500">
            Track submitted applications, interview stages, and saved opportunities.
          </p>
        </div>

        <button
          onClick={() => appDispatch({ type: 'SET_VIEW', payload: 'find-jobs' })}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Explore More Jobs</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('applied')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'applied'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Applied Jobs ({jobApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'saved'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Jobs ({savedJobIds.length})</span>
        </button>
      </div>

      {/* Tab 1: Applied Jobs */}
      {activeTab === 'applied' && (
        <div className="space-y-4">
          {jobApplications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No applications submitted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our curated listings and submit your first application with one click.
              </p>
              <button
                onClick={() => appDispatch({ type: 'SET_VIEW', payload: 'find-jobs' })}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Find Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobApplications.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                if (!job) return null;

                const match = matchJob(candidateProfile, job);

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between flex-wrap gap-4 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-700 to-violet-700 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                          <span className="text-xs font-semibold text-slate-500">
                            @ {job.company}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {job.location} (
                            {job.workMode})
                          </span>
                          <span>•</span>
                          <span>Applied on {app.appliedAt}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {match.total}% Compatibility
                      </span>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>

                      {/* Demo Status Simulator */}
                      <button
                        onClick={() =>
                          jobDispatch({
                            type: 'SIMULATE_STATUS_UPDATE',
                            payload: {
                              applicationId: app.id,
                              newStatus: getNextStatus(app.status),
                            },
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 flex items-center gap-1 cursor-pointer transition"
                        title="Simulate hiring team status transition"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Simulate Next Stage</span>
                      </button>

                      <button
                        onClick={() => setInspectingJob(job)}
                        className="px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Jobs */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedJobIds.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No saved jobs yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bookmark exciting jobs on the Find Jobs page to review or apply later.
              </p>
              <button
                onClick={() => appDispatch({ type: 'SET_VIEW', payload: 'find-jobs' })}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Browse Listings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedJobIds.map((id) => {
                const job = jobs.find((j) => j.id === id);
                if (!job) return null;

                const match = matchJob(candidateProfile, job);
                const isApplied = jobApplications.some((a) => a.jobId === job.id);

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                            {job.company}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 mt-1">{job.title}</h3>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          {match.total}% Fit
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {job.location} ({job.workMode}) • {job.salaryRange}
                        </span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => jobDispatch({ type: 'TOGGLE_SAVE_JOB', payload: job.id })}
                        className="text-slate-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setInspectingJob(job)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                        >
                          Details
                        </button>

                        {isApplied ? (
                          <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100">
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => jobDispatch({ type: 'APPLY_JOB', payload: job.id })}
                            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Apply</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Inspect Modal */}
      {inspectingJob && (
        <JobDetailModal
          job={inspectingJob}
          match={matchJob(candidateProfile, inspectingJob)}
          onClose={() => setInspectingJob(null)}
        />
      )}
    </div>
  );
};
