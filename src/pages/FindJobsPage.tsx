import React, { useState, useMemo } from 'react';
import { useJobs } from '../state/JobContext';
import { useApp } from '../state/AppContext';
import { matchJob } from '../lib/jobMatching';
import { JobDetailModal } from '../components/JobDetailModal';
import { JobScoreBreakdown } from '../components/JobScoreBreakdown';
import { Job } from '../jobTypes';
import { 
  Search, 
  MapPin, 
  Clock, 
  Briefcase, 
  Sparkles, 
  Bookmark, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  X, 
  RotateCcw,
  Info,
  Calendar,
  Layers,
  Building2,
  TrendingUp,
  FileText
} from 'lucide-react';

export const FindJobsPage: React.FC = () => {
  const { jobState, jobDispatch } = useJobs();
  const { dispatch: appDispatch } = useApp();
  const { jobs, candidateProfile, savedJobIds, jobApplications } = jobState;

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterWorkMode, setFilterWorkMode] = useState('All');
  const [filterJobType, setFilterJobType] = useState('All');
  const [filterExpLevel, setFilterExpLevel] = useState('All');
  const [filterSkill, setFilterSkill] = useState('All');
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'deadline'>('match');

  // Modal inspection
  const [inspectingJob, setInspectingJob] = useState<Job | null>(null);

  // Compute live match scores for all jobs against active candidate profile
  const matchedJobs = useMemo(() => {
    return jobs.map((j) => {
      const match = matchJob(candidateProfile, j);
      return { job: j, match };
    });
  }, [jobs, candidateProfile]);

  // Apply filters and sorting
  const filteredList = useMemo(() => {
    return matchedJobs
      .filter(({ job }) => {
        const matchesSearch =
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
          job.preferredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLocation =
          filterLocation === 'All' || job.location === filterLocation;

        const matchesWorkMode =
          filterWorkMode === 'All' || job.workMode === filterWorkMode;

        const matchesJobType =
          filterJobType === 'All' || job.type === filterJobType;

        const matchesSkill =
          filterSkill === 'All' ||
          job.requiredSkills.some((s) => s.toLowerCase() === filterSkill.toLowerCase()) ||
          job.preferredSkills.some((s) => s.toLowerCase() === filterSkill.toLowerCase());

        let matchesExp = true;
        if (filterExpLevel === 'fresher') {
          matchesExp = job.minYears === 0 || job.type === 'Internship';
        } else if (filterExpLevel === '1-3') {
          matchesExp = job.minYears >= 1 && job.minYears <= 3;
        } else if (filterExpLevel === '3+') {
          matchesExp = job.minYears >= 3;
        }

        return (
          matchesSearch &&
          matchesLocation &&
          matchesWorkMode &&
          matchesJobType &&
          matchesSkill &&
          matchesExp
        );
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.match.total - a.match.total;
        }
        if (sortBy === 'newest') {
          return new Date(b.job.postedDate).getTime() - new Date(a.job.postedDate).getTime();
        }
        if (sortBy === 'deadline') {
          return new Date(a.job.deadline).getTime() - new Date(b.job.deadline).getTime();
        }
        return 0;
      });
  }, [
    matchedJobs,
    searchTerm,
    filterLocation,
    filterWorkMode,
    filterJobType,
    filterExpLevel,
    filterSkill,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterLocation('All');
    setFilterWorkMode('All');
    setFilterJobType('All');
    setFilterExpLevel('All');
    setFilterSkill('All');
    setSortBy('match');
  };

  const getScoreColor = (total: number) => {
    if (total >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (total >= 60) return 'text-indigo-700 bg-indigo-50 border-indigo-300';
    if (total >= 40) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-slate-600 bg-slate-100 border-slate-300';
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner with Candidate Summary & Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-900/60 shadow-lg flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              Personalized Matching Engine
            </span>
            <span className="text-xs text-slate-400">
              Acting as candidate: <strong className="text-white">{candidateProfile.name}</strong>
            </span>
          </div>
          <h1 className="text-xl font-black text-white">Find Jobs & Internships</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            {candidateProfile.education} • {candidateProfile.yearsOfExperience} yrs experience •{' '}
            {candidateProfile.skills.slice(0, 5).join(', ')}
            {candidateProfile.skills.length > 5 ? ` +${candidateProfile.skills.length - 5} more` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => appDispatch({ type: 'SET_VIEW', payload: 'upload-resume' })}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Update Resume</span>
          </button>
        </div>
      </div>

      {/* Demo Listings Label */}
      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">Demo listings — fictional companies, not real vacancies.</span>
        </div>
        <span className="text-[11px] text-amber-700">
          Rankings computed locally from your Candidate Profile skills & location.
        </span>
      </div>

      {/* Search & Filter Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, company, skill..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 font-medium"
            />
          </div>

          {/* Location Filter */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600 font-medium"
          >
            <option value="All">All Locations</option>
            <option value="Delhi">Delhi</option>
            <option value="Noida">Noida</option>
            <option value="Gurgaon">Gurgaon</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Work Mode */}
          <select
            value={filterWorkMode}
            onChange={(e) => setFilterWorkMode(e.target.value)}
            className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600 font-medium"
          >
            <option value="All">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Job Type */}
          <select
            value={filterJobType}
            onChange={(e) => setFilterJobType(e.target.value)}
            className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600 font-medium"
          >
            <option value="All">All Job Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        {/* Secondary Filters Strip */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Experience level */}
            <select
              value={filterExpLevel}
              onChange={(e) => setFilterExpLevel(e.target.value)}
              className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none font-medium"
            >
              <option value="All">Any Experience</option>
              <option value="fresher">Freshers / Interns (0-1 yrs)</option>
              <option value="1-3">1-3 Years</option>
              <option value="3+">3+ Years</option>
            </select>

            {/* Primary Skill */}
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none font-medium"
            >
              <option value="All">Filter By Skill</option>
              <option value="React">React</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
              <option value="SQL">SQL</option>
              <option value="Figma">Figma</option>
              <option value="Docker">Docker</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="font-semibold text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-2.5 py-1.5 focus:outline-none font-semibold text-slate-800"
              >
                <option value="match">Best Match (AI Score)</option>
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline Soonest</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-semibold">
              Showing <strong className="text-slate-800">{filteredList.length}</strong> listings
            </span>
            <button
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No jobs match your filter criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or selecting "All Locations" and "All Work Modes".
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Job Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map(({ job, match }) => {
            const isSaved = savedJobIds.includes(job.id);
            const isApplied = jobApplications.some((a) => a.jobId === job.id);

            const daysLeft = Math.ceil(
              (new Date(job.deadline).getTime() - Date.now()) / (1000 * 3600 * 24)
            );
            const isClosingSoon = daysLeft <= 7;

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Company & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-violet-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 leading-tight block">
                          {job.company}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Posted {job.postedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {job.type}
                      </span>
                      <button
                        onClick={() => jobDispatch({ type: 'TOGGLE_SAVE_JOB', payload: job.id })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                        title={isSaved ? 'Remove from saved' : 'Save job'}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-indigo-600 text-indigo-600' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{job.description}</p>
                  </div>

                  {/* Location & Compensation */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location} ({job.workMode})
                    </span>
                    <span className="font-semibold text-slate-800">{job.salaryRange}</span>
                  </div>

                  {/* Skills Chips (Teal for matched, muted for missing) */}
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 4).map((s, idx) => {
                      const isMatched = match.matchedRequired.includes(s);
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                            isMatched
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {s} {isMatched && '✓'}
                        </span>
                      );
                    })}
                    {job.requiredSkills.length > 4 && (
                      <span className="text-[10px] text-slate-400 px-1 py-0.5">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Compatibility Score */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-600 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        AI Compatibility:
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getScoreColor(
                          match.total
                        )}`}
                      >
                        {match.total}% Fit
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          match.total >= 80
                            ? 'bg-emerald-500'
                            : match.total >= 60
                            ? 'bg-indigo-600'
                            : match.total >= 40
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${match.total}%` }}
                      />
                    </div>
                  </div>

                  {/* Deadline warning */}
                  {isClosingSoon && (
                    <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Closes in {daysLeft} days ({job.deadline})
                    </p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingJob(job)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                  >
                    View Details
                  </button>

                  {isApplied ? (
                    <button
                      disabled
                      className="px-4 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold cursor-not-allowed flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => jobDispatch({ type: 'APPLY_JOB', payload: job.id })}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition"
                    >
                      <Send className="w-3 h-3" />
                      <span>Apply</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Modal */}
      {inspectingJob && (
        <JobDetailModal
          job={inspectingJob}
          match={
            matchedJobs.find((m) => m.job.id === inspectingJob.id)?.match ||
            matchJob(candidateProfile, inspectingJob)
          }
          onClose={() => setInspectingJob(null)}
        />
      )}
    </div>
  );
};
