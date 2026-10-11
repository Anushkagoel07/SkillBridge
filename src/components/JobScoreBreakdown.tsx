import React from 'react';
import { JobMatchResult } from '../jobTypes';
import { Sparkles, CheckCircle2, AlertCircle, Briefcase, MapPin, Clock } from 'lucide-react';

interface JobScoreBreakdownProps {
  match: JobMatchResult;
  compact?: boolean;
}

export const JobScoreBreakdown: React.FC<JobScoreBreakdownProps> = ({ match, compact = false }) => {
  const getBadgeColor = (total: number) => {
    if (total >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (total >= 60) return 'text-indigo-700 bg-indigo-50 border-indigo-300';
    if (total >= 40) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-slate-600 bg-slate-100 border-slate-300';
  };

  const getBarColor = (total: number) => {
    if (total >= 80) return 'bg-emerald-500';
    if (total >= 60) return 'bg-indigo-600';
    if (total >= 40) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">Compatibility:</span>
          <span className={`px-2 py-0.5 rounded-full font-bold border text-[11px] ${getBadgeColor(match.total)}`}>
            {match.total}% Match
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getBarColor(match.total)}`}
            style={{ width: `${match.total}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Compatibility Scoring Breakdown
            </h4>
            <p className="text-[10px] text-slate-500">
              Estimated demo compatibility score — not a hiring decision.
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-black border ${getBadgeColor(match.total)}`}>
          {match.total}% Overall Match
        </span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2.5 text-xs">
        {/* Required Skills (70%) */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              Required Skills Fit
              <span className="text-[10px] text-slate-400 font-normal">(70% weight)</span>
            </span>
            <span className="font-bold text-slate-700">{match.requiredScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${match.requiredScore}%` }}
            />
          </div>
        </div>

        {/* Preferred Skills (15%) */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              Preferred Skills Bonus
              <span className="text-[10px] text-slate-400 font-normal">(15% weight)</span>
            </span>
            <span className="font-bold text-slate-700">{match.preferredScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${match.preferredScore}%` }}
            />
          </div>
        </div>

        {/* Experience Compatibility (10%) */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              Experience Level Fit
              <span className="text-[10px] text-slate-400 font-normal">(10% weight)</span>
            </span>
            <span className="font-bold text-slate-700">{match.experienceScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${match.experienceScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {match.experienceLabel}
          </p>
        </div>

        {/* Location & Work Mode (5%) */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-600">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              Location / Work Mode
              <span className="text-[10px] text-slate-400 font-normal">(5% weight)</span>
            </span>
            <span className="font-bold text-slate-700">{match.locationScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${match.locationScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {match.locationLabel}
          </p>
        </div>
      </div>

      {/* Chips: Matched vs Missing */}
      <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
        {match.matchedRequired.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 text-[11px]">
            <span className="font-semibold text-teal-700 flex items-center gap-0.5 mr-1">
              <CheckCircle2 className="w-3 h-3 text-teal-600" /> Matched:
            </span>
            {match.matchedRequired.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {match.missingRequired.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 text-[11px]">
            <span className="font-semibold text-slate-500 flex items-center gap-0.5 mr-1">
              <AlertCircle className="w-3 h-3 text-slate-400" /> Missing:
            </span>
            {match.missingRequired.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600 line-through text-[10px]"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Explanation Quote */}
      <div className="p-2.5 rounded-xl bg-violet-50/80 border border-violet-100 text-[11px] text-violet-950 leading-relaxed">
        <span className="font-bold text-violet-900">Analysis: </span>
        {match.explanation}
      </div>
    </div>
  );
};
