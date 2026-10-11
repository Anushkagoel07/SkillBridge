import React from 'react';
import { MatchResult } from '../types';
import { Sparkles, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScoreBreakdownProps {
  match: MatchResult;
  compact?: boolean;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ match, compact = false }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    if (score >= 45) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-indigo-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Compatibility Score</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(match.total)}`}>
            {match.total}% Match
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(match.total)}`}
            style={{ width: `${match.total}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-indigo-100 text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            AI Intelligent Score Breakdown
          </span>
        </div>
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(match.total)}`}>
          {match.total}% Overall Match
        </div>
      </div>

      {/* 3 Metric Bars with Weights */}
      <div className="space-y-2.5 text-xs">
        {/* Skills */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-600">
            <span className="font-medium flex items-center gap-1">
              <span className="font-semibold text-slate-800">Skills Alignment</span>
              <span className="text-[10px] text-slate-400 font-normal">(60% weight)</span>
            </span>
            <span className="font-bold text-slate-700">{match.skillScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${match.skillScore}%` }}
            />
          </div>
        </div>

        {/* Availability */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-600">
            <span className="font-medium flex items-center gap-1">
              <span className="font-semibold text-slate-800">Availability Fit</span>
              <span className="text-[10px] text-slate-400 font-normal">(25% weight)</span>
            </span>
            <span className="font-bold text-slate-700">{match.availabilityScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${match.availabilityScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {match.availabilityLabel}
          </p>
        </div>

        {/* Location */}
        <div>
          <div className="flex justify-between items-center mb-1 text-slate-600">
            <span className="font-medium flex items-center gap-1">
              <span className="font-semibold text-slate-800">Location Proximity</span>
              <span className="text-[10px] text-slate-400 font-normal">(15% weight)</span>
            </span>
            <span className="font-bold text-slate-700">{match.locationScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-300"
              style={{ width: `${match.locationScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {match.locationLabel}
          </p>
        </div>
      </div>

      {/* Skill tags matching & missing */}
      <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
        {match.matchingSkills.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5 mr-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Matches:
            </span>
            {match.matchingSkills.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] font-medium bg-emerald-100/70 text-emerald-800 rounded-md border border-emerald-200"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {match.missingSkills.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-0.5 mr-1">
              <AlertCircle className="w-3 h-3 text-slate-400" /> Lacks:
            </span>
            {match.missingSkills.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] font-medium bg-slate-200/80 text-slate-600 rounded-md line-through"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Transparent Plain English Explanation */}
      <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 leading-relaxed">
        <span className="font-semibold text-indigo-900">Match Synthesis: </span>
        {match.explanation}
      </div>
    </div>
  );
};
