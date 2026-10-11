import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Job, CandidateProfile, JobApplication, JobApplicationStatus } from '../jobTypes';
import { MOCK_JOBS } from '../data/jobs';

const JOB_STORAGE_KEY = 'skillbridge_jobs_v1';

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  name: 'Aisha Khan',
  email: 'aisha.khan@example.com',
  phone: '+91 98765 43210',
  education: 'B.Tech in Computer Science (2024)',
  yearsOfExperience: 1,
  location: 'Noida',
  preferredWorkMode: 'Hybrid',
  preferredJobType: 'Full-time',
  skills: [
    'React',
    'TypeScript',
    'JavaScript',
    'HTML',
    'CSS',
    'Tailwind',
    'Git',
    'Node.js',
    'SQL',
  ],
  parsedFromResume: false,
};

interface JobState {
  jobs: Job[];
  candidateProfile: CandidateProfile;
  savedJobIds: string[];
  jobApplications: JobApplication[];
  uploadStep: number; // 1 to 5
  selectedJobId: string | null;
  toastMessage: string | null;
}

type JobAction =
  | { type: 'UPDATE_PROFILE'; payload: Partial<CandidateProfile> }
  | { type: 'LOAD_SAMPLE_PROFILE' }
  | { type: 'TOGGLE_SAVE_JOB'; payload: string }
  | { type: 'APPLY_JOB'; payload: string }
  | { type: 'SIMULATE_STATUS_UPDATE'; payload: { applicationId: string; newStatus: JobApplicationStatus } }
  | { type: 'SET_UPLOAD_STEP'; payload: number }
  | { type: 'SELECT_JOB'; payload: string | null }
  | { type: 'SET_JOB_TOAST'; payload: string | null }
  | { type: 'RESET_JOB_DEMO' };

const INITIAL_JOB_STATE: JobState = {
  jobs: MOCK_JOBS,
  candidateProfile: DEFAULT_CANDIDATE_PROFILE,
  savedJobIds: ['job-1', 'job-5'],
  jobApplications: [
    {
      id: 'app-seed-1',
      jobId: 'job-2',
      status: 'Under Review',
      appliedAt: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    },
  ],
  uploadStep: 1,
  selectedJobId: null,
  toastMessage: null,
};

function getInitialJobState(): JobState {
  try {
    const raw = localStorage.getItem(JOB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.jobs && parsed.candidateProfile) {
        return {
          ...parsed,
          toastMessage: null,
        };
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_JOB_STATE;
}

function jobReducer(state: JobState, action: JobAction): JobState {
  switch (action.type) {
    case 'UPDATE_PROFILE': {
      const updated = { ...state.candidateProfile, ...action.payload };
      return {
        ...state,
        candidateProfile: updated,
        toastMessage: 'Candidate profile updated! Job match scores recalculated.',
      };
    }

    case 'LOAD_SAMPLE_PROFILE':
      return {
        ...state,
        candidateProfile: DEFAULT_CANDIDATE_PROFILE,
        uploadStep: 3,
        toastMessage: 'Sample profile (Aisha Khan — React/TS Developer) loaded.',
      };

    case 'TOGGLE_SAVE_JOB': {
      const jobId = action.payload;
      const isSaved = state.savedJobIds.includes(jobId);
      const updatedSaved = isSaved
        ? state.savedJobIds.filter((id) => id !== jobId)
        : [...state.savedJobIds, jobId];
      return {
        ...state,
        savedJobIds: updatedSaved,
        toastMessage: isSaved ? 'Job removed from saved list.' : 'Job saved to your bookmarks!',
      };
    }

    case 'APPLY_JOB': {
      const jobId = action.payload;
      const alreadyApplied = state.jobApplications.some((a) => a.jobId === jobId);
      if (alreadyApplied) return state;

      const job = state.jobs.find((j) => j.id === jobId);
      const newApp: JobApplication = {
        id: `jobapp-${Date.now()}`,
        jobId,
        status: 'Applied',
        appliedAt: new Date().toISOString().split('T')[0],
      };

      return {
        ...state,
        jobApplications: [newApp, ...state.jobApplications],
        toastMessage: `Applied for "${job?.title || 'Job'}" at ${job?.company || ''}!`,
      };
    }

    case 'SIMULATE_STATUS_UPDATE': {
      const { applicationId, newStatus } = action.payload;
      return {
        ...state,
        jobApplications: state.jobApplications.map((a) =>
          a.id === applicationId ? { ...a, status: newStatus } : a
        ),
        toastMessage: `Application status updated to "${newStatus}" (demo simulation).`,
      };
    }

    case 'SET_UPLOAD_STEP':
      return {
        ...state,
        uploadStep: action.payload,
      };

    case 'SELECT_JOB':
      return {
        ...state,
        selectedJobId: action.payload,
      };

    case 'SET_JOB_TOAST':
      return {
        ...state,
        toastMessage: action.payload,
      };

    case 'RESET_JOB_DEMO':
      localStorage.removeItem(JOB_STORAGE_KEY);
      return {
        ...INITIAL_JOB_STATE,
        toastMessage: 'Job & Internship dataset reset to initial state.',
      };

    default:
      return state;
  }
}

interface JobContextValue {
  jobState: JobState;
  jobDispatch: React.Dispatch<JobAction>;
}

const JobContext = createContext<JobContextValue | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobState, jobDispatch] = useReducer(jobReducer, undefined, getInitialJobState);

  useEffect(() => {
    try {
      localStorage.setItem(
        JOB_STORAGE_KEY,
        JSON.stringify({
          jobs: jobState.jobs,
          candidateProfile: jobState.candidateProfile,
          savedJobIds: jobState.savedJobIds,
          jobApplications: jobState.jobApplications,
          uploadStep: jobState.uploadStep,
          selectedJobId: jobState.selectedJobId,
        })
      );
    } catch {
      // ignore storage error
    }
  }, [jobState]);

  useEffect(() => {
    const handleReset = () => {
      jobDispatch({ type: 'RESET_JOB_DEMO' });
    };
    window.addEventListener('skillbridge-reset-job-demo', handleReset);
    return () => window.removeEventListener('skillbridge-reset-job-demo', handleReset);
  }, []);

  useEffect(() => {
    if (jobState.toastMessage) {
      const t = setTimeout(() => {
        jobDispatch({ type: 'SET_JOB_TOAST', payload: null });
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [jobState.toastMessage]);

  return <JobContext.Provider value={{ jobState, jobDispatch }}>{children}</JobContext.Provider>;
};

export function useJobs(): JobContextValue {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
