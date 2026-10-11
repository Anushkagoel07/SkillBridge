export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type JobType = 'Full-time' | 'Internship' | 'Part-time';
export type JobApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Rejected';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  location: string;
  workMode: WorkMode;
  experienceRequired: string; // e.g. "0-1 years", "1-3 years"
  minYears: number;
  maxYears: number;
  salaryRange: string; // e.g. "₹15,000–25,000/month" or "₹6–9 LPA"
  type: JobType;
  deadline: string; // ISO date string in future
  postedDate: string;
  responsibilities: string[];
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone?: string;
  education: string;
  yearsOfExperience: number;
  location: string;
  preferredWorkMode: WorkMode;
  preferredJobType: JobType;
  skills: string[];
  parsedFromResume?: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  status: JobApplicationStatus;
  appliedAt: string;
}

export interface JobMatchResult {
  total: number; // 0-100 integer
  requiredScore: number;
  preferredScore: number;
  experienceScore: number;
  locationScore: number;
  matchedRequired: string[];
  matchedPreferred: string[];
  missingRequired: string[];
  missingPreferred: string[];
  experienceLabel: string;
  locationLabel: string;
  explanation: string;
}
