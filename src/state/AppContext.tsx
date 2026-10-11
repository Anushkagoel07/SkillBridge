import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Opportunity, Volunteer, Application, UserRole } from '../types';
import { SEED_VOLUNTEERS, SEED_OPPORTUNITIES, SEED_APPLICATIONS } from '../data/seed';

const STORAGE_KEY = 'skillbridge_state_v1';

const INITIAL_STATE: AppState = {
  opportunities: SEED_OPPORTUNITIES,
  volunteers: SEED_VOLUNTEERS,
  applications: SEED_APPLICATIONS,
  activeRole: 'ngo',
  activeVolunteerId: 'vol-1', // Default Aisha Khan
  activeNgo: 'Vidya Shiksha Foundation',
  currentView: 'landing',
  selectedOpportunityId: 'opp-1',
  toastMessage: null,
};

type Action =
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'SET_ACTIVE_VOLUNTEER'; payload: string }
  | { type: 'SET_VIEW'; payload: string; selectedOpportunityId?: string }
  | { type: 'SELECT_OPPORTUNITY'; payload: string }
  | { type: 'POST_OPPORTUNITY'; payload: Omit<Opportunity, 'id' | 'createdAt' | 'status'> }
  | { type: 'INVITE_VOLUNTEER'; payload: { opportunityId: string; volunteerId: string } }
  | { type: 'APPLY_OPPORTUNITY'; payload: { opportunityId: string; volunteerId: string } }
  | { type: 'ACCEPT_APPLICATION'; payload: string }
  | { type: 'DECLINE_APPLICATION'; payload: string }
  | { type: 'MARK_WORK_COMPLETED'; payload: { opportunityId: string; volunteerId: string; applicationId: string } }
  | { type: 'UPDATE_VOLUNTEER_PROFILE'; payload: Partial<Volunteer> & { id: string } }
  | { type: 'RESET_DEMO' }
  | { type: 'SET_TOAST'; payload: string | null };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        activeRole: action.payload,
        currentView: action.payload === 'ngo' ? 'ngo-dashboard' : 'volunteer-dashboard',
      };

    case 'SET_ACTIVE_VOLUNTEER':
      return {
        ...state,
        activeVolunteerId: action.payload,
      };

    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
        selectedOpportunityId: action.selectedOpportunityId ?? state.selectedOpportunityId,
      };

    case 'SELECT_OPPORTUNITY':
      return {
        ...state,
        selectedOpportunityId: action.payload,
        currentView: 'opportunity-matches',
      };

    case 'POST_OPPORTUNITY': {
      const newOpp: Opportunity = {
        ...action.payload,
        id: `opp-${Date.now()}`,
        status: 'Open',
        createdAt: new Date().toISOString().split('T')[0],
      };
      return {
        ...state,
        opportunities: [newOpp, ...state.opportunities],
        selectedOpportunityId: newOpp.id,
        currentView: 'opportunity-matches',
        toastMessage: `Opportunity "${newOpp.title}" created successfully! Matching volunteers computed.`,
      };
    }

    case 'INVITE_VOLUNTEER': {
      const { opportunityId, volunteerId } = action.payload;
      const existing = state.applications.find(
        (a) => a.opportunityId === opportunityId && a.volunteerId === volunteerId
      );
      if (existing) return state;

      const newApp: Application = {
        id: `app-${Date.now()}`,
        opportunityId,
        volunteerId,
        type: 'invited',
        status: 'Invited',
        createdAt: new Date().toISOString().split('T')[0],
      };

      const volunteer = state.volunteers.find((v) => v.id === volunteerId);
      return {
        ...state,
        applications: [newApp, ...state.applications],
        toastMessage: `Invitation sent to ${volunteer?.name || 'volunteer'}!`,
      };
    }

    case 'APPLY_OPPORTUNITY': {
      const { opportunityId, volunteerId } = action.payload;
      const existing = state.applications.find(
        (a) => a.opportunityId === opportunityId && a.volunteerId === volunteerId
      );
      if (existing) return state;

      const newApp: Application = {
        id: `app-${Date.now()}`,
        opportunityId,
        volunteerId,
        type: 'applied',
        status: 'Pending',
        createdAt: new Date().toISOString().split('T')[0],
      };

      const opp = state.opportunities.find((o) => o.id === opportunityId);
      return {
        ...state,
        applications: [newApp, ...state.applications],
        toastMessage: `Applied for "${opp?.title || 'opportunity'}" successfully!`,
      };
    }

    case 'ACCEPT_APPLICATION': {
      const appId = action.payload;
      const targetApp = state.applications.find((a) => a.id === appId);
      if (!targetApp) return state;

      const updatedApps = state.applications.map((a) =>
        a.id === appId ? { ...a, status: 'Accepted' as const } : a
      );

      // Update opportunity to In Progress if currently Open
      const updatedOpps = state.opportunities.map((o) =>
        o.id === targetApp.opportunityId ? { ...o, status: 'In Progress' as const } : o
      );

      return {
        ...state,
        applications: updatedApps,
        opportunities: updatedOpps,
        toastMessage: 'Invitation accepted! Opportunity is now In Progress.',
      };
    }

    case 'DECLINE_APPLICATION': {
      const appId = action.payload;
      return {
        ...state,
        applications: state.applications.map((a) =>
          a.id === appId ? { ...a, status: 'Declined' as const } : a
        ),
        toastMessage: 'Invitation declined.',
      };
    }

    case 'MARK_WORK_COMPLETED': {
      const { opportunityId, volunteerId, applicationId } = action.payload;
      const opp = state.opportunities.find((o) => o.id === opportunityId);
      const hoursToAdd = parseInt(opp?.timeCommitment?.replace(/\D/g, '') || '8', 10);

      const updatedVolunteers = state.volunteers.map((v) =>
        v.id === volunteerId
          ? {
              ...v,
              completedProjects: v.completedProjects + 1,
              hours: v.hours + hoursToAdd,
            }
          : v
      );

      const updatedOpps = state.opportunities.map((o) =>
        o.id === opportunityId ? { ...o, status: 'Completed' as const } : o
      );

      const updatedApps = state.applications.map((a) =>
        a.id === applicationId ? { ...a, status: 'Completed' as const } : a
      );

      return {
        ...state,
        volunteers: updatedVolunteers,
        opportunities: updatedOpps,
        applications: updatedApps,
        toastMessage: `Work marked completed! Added ${hoursToAdd} volunteer hours.`,
      };
    }

    case 'UPDATE_VOLUNTEER_PROFILE': {
      const updatedVolunteers = state.volunteers.map((v) =>
        v.id === action.payload.id ? { ...v, ...action.payload } : v
      );
      return {
        ...state,
        volunteers: updatedVolunteers,
        toastMessage: 'Profile updated! Match scores recomputed immediately.',
      };
    }

    case 'RESET_DEMO':
      localStorage.removeItem(STORAGE_KEY);
      return {
        ...INITIAL_STATE,
        toastMessage: 'Demo data reset to initial baseline state.',
      };

    case 'SET_TOAST':
      return {
        ...state,
        toastMessage: action.payload,
      };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function getInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.opportunities && parsed.volunteers && parsed.applications) {
        return {
          ...parsed,
          toastMessage: null,
        };
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_STATE;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          opportunities: state.opportunities,
          volunteers: state.volunteers,
          applications: state.applications,
          activeRole: state.activeRole,
          activeVolunteerId: state.activeVolunteerId,
          activeNgo: state.activeNgo,
          currentView: state.currentView,
          selectedOpportunityId: state.selectedOpportunityId,
        })
      );
    } catch {
      // ignore storage write errors
    }
  }, [state]);

  // Auto clear toast
  useEffect(() => {
    if (state.toastMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_TOAST', payload: null });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.toastMessage]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
