import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { matchVolunteer } from '../lib/matching';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Building2,
  Filter,
  Send,
  Layers
} from 'lucide-react';
import { Opportunity, MatchResult } from '../types';

export const MarketplacePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { opportunities, applications, volunteers, activeVolunteerId } = state;

  const activeVolunteer =
    volunteers.find((v) => v.id === activeVolunteerId) || volunteers[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterUrgency, setFilterUrgency] = useState('All');
  const [filterSkill, setFilterSkill] = useState('All');

  // Modal match preview
  const [inspectModal, setInspectModal] = useState<{
    opportunity: Opportunity;
    match: MatchResult;
  } | null>(null);

  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      filterLocation === 'All' || opp.location === filterLocation;

    const matchesUrgency =
      filterUrgency === 'All' || opp.urgency === filterUrgency;

    const matchesSkill =
      filterSkill === 'All' ||
      opp.requiredSkills.some((s) => s.toLowerCase() === filterSkill.toLowerCase());

    return matchesSearch && matchesLocation && matchesUrgency && matchesSkill;
  });

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Active Volunteer Banner */}
      <div className="bg-gradient-to-r from-violet-900 to-indigo-950 rounded-2xl p-5 text-white border border-violet-800 shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/40 text-violet-200 flex items-center justify-center font-bold border border-violet-400/30">
            {activeVolunteer?.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-violet-300">Viewing Causes As:</span>
              <span className="text-sm font-bold text-white">{activeVolunteer?.name}</span>
            </div>
            <p className="text-xs text-slate-300">
              {activeVolunteer?.location} • {activeVolunteer?.skills.slice(0, 3).join(', ')} •{' '}
              {activeVolunteer?.availability.join(', ')}
            </p>
          </div>
        </div>

        <div className="text-xs bg-violet-950/70 px-3 py-1.5 rounded-xl border border-violet-700/50 text-teal-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>Match percentages calculated in real-time</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search causes, NGOs, skills..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600"
          >
            <option value="All">All Locations</option>
            <option value="Delhi">Delhi</option>
            <option value="Noida">Noida</option>
            <option value="Gurgaon">Gurgaon</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600"
          >
            <option value="All">All Urgency Levels</option>
            <option value="High">High Urgency</option>
            <option value="Medium">Medium Urgency</option>
            <option value="Low">Low Urgency</option>
          </select>

          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="bg-slate-50 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600"
          >
            <option value="All">Filter By Primary Skill</option>
            <option value="React">React</option>
            <option value="Teaching">Teaching</option>
            <option value="Graphic Design">Graphic Design</option>
            <option value="Logistics">Logistics</option>
            <option value="Python">Python</option>
            <option value="Fundraising">Fundraising</option>
          </select>
        </div>
      </div>

      {/* Opportunity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map((opp) => {
          const match = activeVolunteer
            ? matchVolunteer(activeVolunteer, opp)
            : { total: 0, skillScore: 0, availabilityScore: 0, locationScore: 0, matchingSkills: [], missingSkills: [], explanation: '', availabilityLabel: '', locationLabel: '' };

          // Check if user already applied or was invited
          const userApp = applications.find(
            (a) => a.opportunityId === opp.id && a.volunteerId === activeVolunteerId
          );

          const isApplied = userApp?.type === 'applied';
          const isInvited = userApp?.type === 'invited';
          const isAccepted = userApp?.status === 'Accepted';

          return (
            <div
              key={opp.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 hover:border-violet-300 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {opp.ngoName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getUrgencyBadge(opp.urgency)}`}>
                    {opp.urgency} Urgency
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{opp.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{opp.description}</p>
                </div>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.requiredSkills.map((skill, sIdx) => {
                    const hasSkill = activeVolunteer?.skills.some(
                      (vs) => vs.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <span
                        key={sIdx}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                          hasSkill
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {skill} {hasSkill && '✓'}
                      </span>
                    );
                  })}
                </div>

                {/* Schedule and Location */}
                <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>
                      {opp.timeCommitment} • {opp.availability.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Compact Compatibility Preview */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-600">Your AI Fit:</span>
                    <button
                      onClick={() => setInspectModal({ opportunity: opp, match })}
                      className="text-violet-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5 text-[11px]"
                    >
                      <Sparkles className="w-3 h-3 text-violet-500" />
                      <span>{match.total}% (Inspect)</span>
                    </button>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        match.total >= 75 ? 'bg-emerald-500' : match.total >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${match.total}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectModal({ opportunity: opp, match })}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  View Details
                </button>

                {isAccepted ? (
                  <button
                    disabled
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold cursor-not-allowed flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accepted</span>
                  </button>
                ) : isInvited ? (
                  <button
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'volunteer-dashboard' })}
                    className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Respond to Invite</span>
                  </button>
                ) : isApplied ? (
                  <button
                    disabled
                    className="px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold cursor-not-allowed flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Applied</span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'APPLY_OPPORTUNITY',
                        payload: {
                          opportunityId: opp.id,
                          volunteerId: activeVolunteerId,
                        },
                      })
                    }
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-sm cursor-pointer flex items-center gap-1.5 transition"
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

      {/* Match Inspect Modal */}
      {inspectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                  {inspectModal.opportunity.ngoName}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {inspectModal.opportunity.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {inspectModal.opportunity.description}
            </p>

            {/* Score Breakdown inside modal */}
            <ScoreBreakdown match={inspectModal.match} />

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setInspectModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: 'APPLY_OPPORTUNITY',
                    payload: {
                      opportunityId: inspectModal.opportunity.id,
                      volunteerId: activeVolunteerId,
                    },
                  });
                  setInspectModal(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-sm"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
