import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { 
  Users, 
  MapPin, 
  Clock, 
  Award, 
  Search, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export const VolunteersPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const filteredVolunteers = state.volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      v.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLoc = selectedLocation === 'All' || v.location === selectedLocation;
    return matchesSearch && matchesLoc;
  });

  const getAvatarGradient = (id: string) => {
    const charCode = id.charCodeAt(id.length - 1) || 0;
    if (charCode % 3 === 0) return 'from-indigo-600 to-violet-600';
    if (charCode % 3 === 1) return 'from-teal-500 to-emerald-600';
    return 'from-violet-600 to-rose-500';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Verified Talent Directory
          </h1>
          <p className="text-xs text-slate-500">
            Browse verified community volunteers with specialized skillsets and availability.
          </p>
        </div>

        {/* Search & Location Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills, name, bio..."
              className="pl-9 pr-3 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="text-xs py-2 px-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600"
          >
            <option value="All">All Cities</option>
            <option value="Delhi">Delhi</option>
            <option value="Noida">Noida</option>
            <option value="Gurgaon">Gurgaon</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVolunteers.map((vol) => (
          <div
            key={vol.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getAvatarGradient(
                    vol.id
                  )} text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0`}
                >
                  {vol.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{vol.name}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {vol.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {vol.availability.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{vol.bio}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {vol.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer metrics */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">{vol.hours} Hours</span>
                <span>•</span>
                <span>{vol.completedProjects} Projects</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'opportunity-matches' })}
                className="text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Match
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
