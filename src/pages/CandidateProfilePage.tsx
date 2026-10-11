import React, { useState } from 'react';
import { useJobs } from '../state/JobContext';
import { useApp } from '../state/AppContext';
import { matchJob } from '../lib/jobMatching';
import { WorkMode, JobType } from '../jobTypes';
import { 
  User, 
  Save, 
  Sparkles, 
  Plus, 
  X, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  ArrowRight,
  RefreshCw,
  Award
} from 'lucide-react';

const SUGGESTED_QUICK_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Python',
  'Node.js',
  'SQL',
  'Tailwind',
  'Git',
  'Docker',
  'AWS',
  'Data Analysis',
  'Machine Learning',
  'Figma',
  'SEO',
];

export const CandidateProfilePage: React.FC = () => {
  const { jobState, jobDispatch } = useJobs();
  const { dispatch: appDispatch } = useApp();
  const { candidateProfile, jobs } = jobState;

  const [name, setName] = useState(candidateProfile.name);
  const [email, setEmail] = useState(candidateProfile.email);
  const [education, setEducation] = useState(candidateProfile.education);
  const [years, setYears] = useState(candidateProfile.yearsOfExperience);
  const [location, setLocation] = useState(candidateProfile.location);
  const [workMode, setWorkMode] = useState<WorkMode>(candidateProfile.preferredWorkMode);
  const [jobType, setJobType] = useState<JobType>(candidateProfile.preferredJobType);
  const [skills, setSkills] = useState<string[]>(candidateProfile.skills);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Top 3 job matches for this candidate
  const topMatches = React.useMemo(() => {
    return jobs
      .map((j) => ({ job: j, match: matchJob(candidateProfile, j) }))
      .sort((a, b) => b.match.total - a.match.total)
      .slice(0, 3);
  }, [jobs, candidateProfile]);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setNewSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    jobDispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        name,
        email,
        education,
        yearsOfExperience: Number(years),
        location,
        preferredWorkMode: workMode,
        preferredJobType: jobType,
        skills,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            My Candidate Profile & Career Preferences
          </h1>
          <p className="text-xs text-slate-500">
            Keep your skills and target role preferences updated to receive high-precision AI job matches.
          </p>
        </div>

        <button
          onClick={() => jobDispatch({ type: 'LOAD_SAMPLE_PROFILE' })}
          className="px-3.5 py-1.5 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold border border-violet-200 transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Aisha Khan</span>
        </button>
      </div>

      {/* Top 3 Matches Widget */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-indigo-900/60 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <h2 className="text-sm font-bold text-white">Top 3 Recommended Matches For You</h2>
          </div>
          <button
            onClick={() => appDispatch({ type: 'SET_VIEW', payload: 'find-jobs' })}
            className="text-xs text-teal-300 hover:text-teal-200 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View All {jobs.length} Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topMatches.map(({ job, match }) => (
            <div
              key={job.id}
              onClick={() => appDispatch({ type: 'SET_VIEW', payload: 'find-jobs' })}
              className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-violet-300 truncate max-w-[120px]">
                  {job.company}
                </span>
                <span className="text-[11px] font-black text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/30">
                  {match.total}% Fit
                </span>
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{job.title}</h4>
              <p className="text-[11px] text-slate-400">
                {job.location} • {job.workMode}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Highest Degree</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Years Experience</label>
            <input
              type="number"
              min={0}
              max={30}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Base</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium bg-white"
            >
              <option value="Delhi">Delhi</option>
              <option value="Noida">Noida</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
        </div>

        {/* Work Mode & Job Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Preferred Work Mode
            </label>
            <div className="flex gap-2">
              {(['Remote', 'Hybrid', 'On-site'] as WorkMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWorkMode(mode)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    workMode === mode
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Role Type</label>
            <div className="flex gap-2">
              {(['Full-time', 'Internship', 'Part-time'] as JobType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setJobType(type)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    jobType === type
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Management */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Active Skill Portfolio ({skills.length})
            </label>
            <span className="text-[11px] text-slate-400">Click × to remove</span>
          </div>

          <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 min-h-[60px]">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="hover:text-rose-200 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add skill (e.g. Next.js, Redux, Docker)..."
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600"
            />
            <button
              type="button"
              onClick={() => addSkill(newSkillInput)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Add
            </button>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUICK_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition cursor-pointer"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md flex items-center gap-2 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate Matches</span>
          </button>
        </div>
      </form>
    </div>
  );
};
