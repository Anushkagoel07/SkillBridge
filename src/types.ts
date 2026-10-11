export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  location: string;
  availability: string[]; // e.g. ["Weekday Evenings", "Weekends", "Weekday Mornings", "Flexible"]
  experience: string;
  completedProjects: number;
  hours: number;
  bio: string;
}

export type UrgencyLevel = 'Low' | 'Medium' | 'High';
export type OpportunityStatus = 'Open' | 'In Progress' | 'Completed';

export interface Opportunity {
  id: string;
  ngoName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  volunteersNeeded: number;
  deadline: string;
  urgency: UrgencyLevel;
  timeCommitment: string;
  availability: string[]; // when work happens
  status: OpportunityStatus;
  createdAt: string;
}

export type ApplicationType = 'applied' | 'invited';
export type ApplicationStatus = 'Pending' | 'Invited' | 'Accepted' | 'Declined' | 'Completed';

export interface Application {
  id: string;
  opportunityId: string;
  volunteerId: string;
  type: ApplicationType;
  status: ApplicationStatus;
  createdAt: string;
}

export type UserRole = 'ngo' | 'volunteer';

export interface MatchResult {
  total: number;
  skillScore: number;
  availabilityScore: number;
  locationScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  explanation: string;
  availabilityLabel: string;
  locationLabel: string;
}

export interface AppState {
  opportunities: Opportunity[];
  volunteers: Volunteer[];
  applications: Application[];
  activeRole: UserRole;
  activeVolunteerId: string;
  activeNgo: string;
  currentView: string;
  selectedOpportunityId?: string;
  toastMessage?: string | null;
}
