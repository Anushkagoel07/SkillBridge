import React from 'react';
import { useApp } from '../state/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  Users,
  BarChart3,
  Compass,
  FileCheck2,
  UserCheck,
  Building,
  HeartHandshake,
  Layers,
  ArrowRight,
  Briefcase,
  Upload,
  Bookmark
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

export const Sidebar: React.FC = () => {
  const { state, dispatch } = useApp();
  const { activeRole, currentView } = state;

  const activeVolunteer = state.volunteers.find((v) => v.id === state.activeVolunteerId);
  const pendingInvitesCount = state.applications.filter(
    (a) => a.volunteerId === state.activeVolunteerId && a.type === 'invited' && a.status === 'Invited'
  ).length;

  const ngoNavItems: NavItem[] = [
    { id: 'ngo-dashboard', label: 'NGO Dashboard', icon: LayoutDashboard },
    { id: 'post-opportunity', label: 'Post Opportunity', icon: PlusCircle },
    { id: 'opportunity-matches', label: 'AI Matches & Dispatch', icon: Sparkles, badge: 'Smart' },
    { id: 'volunteers', label: 'Volunteer Directory', icon: Users },
    { id: 'impact', label: 'Impact Analytics', icon: BarChart3 },
  ];

  const volunteerNavItems: NavItem[] = [
    { id: 'volunteer-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'find-jobs', label: 'Find Jobs & Internships', icon: Briefcase, badge: 'AI' },
    { id: 'upload-resume', label: 'Upload Resume', icon: Upload },
    { id: 'my-job-applications', label: 'Job Applications & Saved', icon: Bookmark },
    { id: 'candidate-profile', label: 'Candidate Career Profile', icon: UserCheck },
    { 
      id: 'volunteer-dashboard', 
      label: 'NGO Invites & Apps', 
      icon: FileCheck2, 
      count: pendingInvitesCount 
    },
    { id: 'marketplace', label: 'Volunteer Marketplace', icon: Compass },
    { id: 'profile', label: 'Volunteer Skills', icon: Users },
    { id: 'impact', label: 'Impact Analytics', icon: BarChart3 },
  ];

  const navItems = activeRole === 'ngo' ? ngoNavItems : volunteerNavItems;

  return (
    <aside className="w-64 bg-slate-900 border-r border-indigo-950 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>{activeRole === 'ngo' ? 'NGO Coordinator Workspace' : 'Volunteer Portal'}</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white font-semibold shadow-md shadow-indigo-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      {item.count} new
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Scenario Quick Guide */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-800/40 text-xs">
          <div className="flex items-center gap-1.5 text-teal-300 font-bold mb-1.5">
            <HeartHandshake className="w-4 h-4 text-teal-400" />
            <span>Interactive Demo Script</span>
          </div>
          <ol className="text-slate-300 text-[11px] space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Post or select an opportunity</li>
            <li>Inspect ranked AI matches & click <strong>Invite</strong></li>
            <li>Switch to <strong>Volunteer</strong> role</li>
            <li><strong>Accept</strong> invitation on dashboard</li>
            <li>Watch live <strong>Impact</strong> stats update!</li>
          </ol>
        </div>
      </div>

      {/* User Status Footer */}
      <div className="p-4 border-t border-indigo-950 bg-slate-950/60">
        {activeRole === 'ngo' ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold">
              VS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Vidya Shiksha Trust</p>
              <p className="text-[11px] text-teal-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                Coordinator Active
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 font-bold">
              {activeVolunteer?.name.slice(0, 2).toUpperCase() || 'VK'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{activeVolunteer?.name}</p>
              <p className="text-[11px] text-violet-300 truncate">
                {activeVolunteer?.hours} hrs · {activeVolunteer?.location}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
