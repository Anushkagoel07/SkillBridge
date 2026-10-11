import React, { useState } from 'react';
import { useJobs } from '../state/JobContext';
import { useApp } from '../state/AppContext';
import { parseResumeFile, parseResumeText, SKILLS_DICTIONARY } from '../lib/resumeParser';
import { WorkMode, JobType } from '../jobTypes';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X, 
  AlertCircle, 
  ArrowRight, 
  UserCheck, 
  Briefcase, 
  FileCheck,
  RefreshCw,
  Plus,
  HelpCircle
} from 'lucide-react';

const SUGGESTED_QUICK_SKILLS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Python',
  'Node.js',
  'SQL',
  'Tailwind',
  'HTML',
  'CSS',
  'Git',
  'Figma',
  'Docker',
  'AWS',
  'Data Analysis',
  'Machine Learning',
  'Canva',
  'SEO',
];

export const UploadResumePage: React.FC = () => {
  const { jobState, jobDispatch } = useJobs();
  const { dispatch: appDispatch } = useApp();
  const { candidateProfile, uploadStep } = jobState;

  // Local form state initialized from context profile
  const [name, setName] = useState(candidateProfile.name);
  const [email, setEmail] = useState(candidateProfile.email);
  const [education, setEducation] = useState(candidateProfile.education);
  const [years, setYears] = useState(candidateProfile.yearsOfExperience);
  const [location, setLocation] = useState(candidateProfile.location);
  const [workMode, setWorkMode] = useState<WorkMode>(candidateProfile.preferredWorkMode);
  const [jobType, setJobType] = useState<JobType>(candidateProfile.preferredJobType);
  const [skills, setSkills] = useState<string[]>(candidateProfile.skills);
  const [newSkillInput, setNewSkillInput] = useState('');

  // File upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Manual text fallback
  const [pastedText, setPastedText] = useState('');
  const [showManualFallback, setShowManualFallback] = useState(false);

  // Stepper labels
  const steps = [
    { num: 1, label: 'Upload Resume' },
    { num: 2, label: 'Extract Profile' },
    { num: 3, label: 'Review / Edit Skills' },
    { num: 4, label: 'Find Matching Jobs' },
    { num: 5, label: 'Apply / Save' },
  ];

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setIsProcessing(true);
    setProcessingStatus('Reading file in-browser...');
    jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 2 });

    try {
      await new Promise((r) => setTimeout(r, 200)); // small UX pause
      setProcessingStatus('Extracting text & matching skill dictionary...');
      const result = await parseResumeFile(file);

      if (result.success && result.profile) {
        // Populate profile form
        setName(result.profile.name);
        setEmail(result.profile.email);
        setEducation(result.profile.education);
        setYears(result.profile.yearsOfExperience);
        setLocation(result.profile.location);
        setSkills(result.profile.skills);
        setWorkMode(result.profile.preferredWorkMode);
        setJobType(result.profile.preferredJobType);

        jobDispatch({ type: 'UPDATE_PROFILE', payload: result.profile });
        jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 3 });
      } else {
        setUploadError(result.error || "We couldn't read text from this file.");
        setShowManualFallback(true);
        jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 1 });
      }
    } catch (err: any) {
      setUploadError(err.message || 'File parsing error occurred.');
      setShowManualFallback(true);
      jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 1 });
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handlePastedTextAnalysis = () => {
    if (!pastedText.trim()) {
      setUploadError('Please paste your resume text before running extraction.');
      return;
    }
    setUploadError(null);
    setIsProcessing(true);
    setProcessingStatus('Analyzing pasted resume text...');
    jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 2 });

    setTimeout(() => {
      const result = parseResumeText(pastedText);
      setIsProcessing(false);

      if (result.success && result.profile) {
        setName(result.profile.name);
        setEmail(result.profile.email);
        setEducation(result.profile.education);
        setYears(result.profile.yearsOfExperience);
        setLocation(result.profile.location);
        setSkills(result.profile.skills);

        jobDispatch({ type: 'UPDATE_PROFILE', payload: result.profile });
        jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 3 });
      } else {
        setUploadError(result.error || 'Could not parse pasted text.');
        jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 1 });
      }
    }, 250);
  };

  const handleLoadSample = () => {
    jobDispatch({ type: 'LOAD_SAMPLE_PROFILE' });
    // Sync local states
    setName('Aisha Khan');
    setEmail('aisha.khan@example.com');
    setEducation('B.Tech in Computer Science (2024)');
    setYears(1);
    setLocation('Noida');
    setWorkMode('Hybrid');
    setJobType('Full-time');
    setSkills([
      'React',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
      'Tailwind',
      'Git',
      'Node.js',
      'SQL',
    ]);
    jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 3 });
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      jobDispatch({ type: 'UPDATE_PROFILE', payload: { skills: updated } });
    }
    setNewSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    jobDispatch({ type: 'UPDATE_PROFILE', payload: { skills: updated } });
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleProceedToJobs = () => {
    handleSaveProfile();
    jobDispatch({ type: 'SET_UPLOAD_STEP', payload: 4 });
    appDispatch({ type: 'SET_VIEW', payload: 'find-jobs' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Title & Intro */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Resume-Based Job & Internship Matcher
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Extract verified tech abilities in seconds. Everything runs 100% locally in your browser.
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-4 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold border border-violet-200 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Load Sample Profile (Aisha Khan)</span>
        </button>
      </div>

      {/* 5-Step Progress Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2">
          {steps.map((st, idx) => {
            const isCompleted = uploadStep > st.num;
            const isCurrent = uploadStep === st.num;

            return (
              <div key={st.num} className="flex items-center gap-2 min-w-max">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.num}
                </div>
                <span
                  className={`text-xs ${
                    isCurrent
                      ? 'font-bold text-slate-900'
                      : isCompleted
                      ? 'font-semibold text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-1 hidden sm:block ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Upload Card & Drag and Drop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dropzone */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Step 1: Upload Document</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-400">PDF or DOCX (Max 5MB)</span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileUpload(file);
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <label htmlFor="resume-file-input" className="cursor-pointer space-y-3 block">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Drag and drop your resume here, or <span className="text-indigo-600">Browse</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports modern PDF and Word (.docx) formats
                </p>
              </div>
            </label>
          </div>

          {/* Processing Status Banner */}
          {isProcessing && (
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold">{processingStatus}</span>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200 text-[11px] text-teal-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Zero-Cloud Privacy:</strong> Your resume is processed locally in your browser and never leaves your device.
            </span>
          </div>
        </div>

        {/* P0: Manual Entry & Paste Text Fallback */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-violet-600" />
              <span>Manual Entry / Paste Resume Text</span>
            </h2>
            <button
              onClick={() => setShowManualFallback(!showManualFallback)}
              className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              {showManualFallback ? 'Collapse' : 'Direct Text Input'}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Have a scanned PDF or plain text CV? Paste the text below to run the same instant deterministic skill analyzer.
          </p>

          <textarea
            rows={5}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw resume text here (e.g. Aisha Khan, B.Tech CSE, 1 year experience in React, TypeScript, Node.js, SQL, Tailwind...)"
            className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-none focus:border-indigo-600"
          />

          <button
            onClick={handlePastedTextAnalysis}
            disabled={!pastedText.trim() || isProcessing}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>Analyze Pasted Text</span>
          </button>
        </div>
      </div>

      {/* Step 3: Review and Edit Parsed Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>Step 3: Review & Refine Candidate Profile</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit the extracted fields or add custom skills. Changes persist instantly and recalculate all job scores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {skills.length} Skills Detected
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Name</label>
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

          {/* Education, Experience, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Years of Experience
              </label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Base Location</label>
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

          {/* Preferred Work Mode and Preferred Job Type */}
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role Type
              </label>
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

          {/* Skills Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Skills Portfolio ({skills.length})
              </label>
              <span className="text-[11px] text-slate-400">Click × to remove</span>
            </div>

            {/* Current Chips */}
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
              {skills.length === 0 && (
                <span className="text-xs text-slate-400 py-1">
                  No skills entered. Add custom skills below or pick from quick suggestions.
                </span>
              )}
            </div>

            {/* Add Custom Skill */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Type a skill (e.g. Next.js, Redux, AWS, PyTorch)..."
                className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => addSkill(newSkillInput)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Add Skill
              </button>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Suggested Quick Add:
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

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 flex-wrap">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Save Profile
            </button>

            <button
              type="button"
              onClick={handleProceedToJobs}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-md flex items-center gap-2 transition cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Find Matching Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
