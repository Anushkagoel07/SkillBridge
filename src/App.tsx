import React, { useState } from 'react';
import { useApp } from './state/AppContext';
import { JobProvider, useJobs } from './state/JobContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AssistantDrawer } from './components/AssistantDrawer';
import { LandingPage } from './pages/LandingPage';
import { NgoDashboard } from './pages/NgoDashboard';
import { PostOpportunityPage } from './pages/PostOpportunityPage';
import { OpportunityMatchesPage } from './pages/OpportunityMatchesPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { VolunteerDashboardPage } from './pages/VolunteerDashboardPage';
import { VolunteerProfilePage } from './pages/VolunteerProfilePage';
import { ImpactPage } from './pages/ImpactPage';
import { FindJobsPage } from './pages/FindJobsPage';
import { UploadResumePage } from './pages/UploadResumePage';
import { MyJobApplicationsPage } from './pages/MyJobApplicationsPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { state, dispatch } = useApp();
  const { jobState, jobDispatch } = useJobs();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Render view
  const renderView = () => {
    switch (state.currentView) {
      case 'landing':
        return <LandingPage />;
      case 'ngo-dashboard':
        return <NgoDashboard />;
      case 'post-opportunity':
        return <PostOpportunityPage />;
      case 'opportunity-matches':
        return <OpportunityMatchesPage />;
      case 'volunteers':
        return <VolunteersPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'volunteer-dashboard':
      case 'applications':
        return <VolunteerDashboardPage />;
      case 'profile':
        return <VolunteerProfilePage />;
      case 'impact':
        return <ImpactPage />;
      // New Job Matcher Routes
      case 'find-jobs':
        return <FindJobsPage />;
      case 'upload-resume':
        return <UploadResumePage />;
      case 'my-job-applications':
        return <MyJobApplicationsPage />;
      case 'candidate-profile':
        return <CandidateProfilePage />;
      default:
        return <LandingPage />;
    }
  };

  const activeToast = state.toastMessage || jobState.toastMessage;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onOpenAssistant={() => setIsAssistantOpen(true)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        {state.currentView !== 'landing' && <Sidebar />}

        {/* Content View */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 ${
            state.currentView === 'landing' ? 'max-w-6xl mx-auto w-full' : ''
          }`}
        >
          {renderView()}
        </main>
      </div>

      {/* AI Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-indigo-500/40 animate-in slide-in-from-bottom duration-200">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{activeToast}</span>
          <button
            onClick={() => {
              dispatch({ type: 'SET_TOAST', payload: null });
              jobDispatch({ type: 'SET_JOB_TOAST', payload: null });
            }}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <JobProvider>
      <AppContent />
    </JobProvider>
  );
};
