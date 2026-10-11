import React, { useState } from 'react';
import { useApp } from '../state/AppContext';
import { 
  PlusCircle, 
  Sparkles, 
  X, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Tag
} from 'lucide-react';
import { UrgencyLevel } from '../types';

const COMMON_SKILLS = [
  'React',
  'TypeScript',
  'Web Development',
  'UI Design',
  'Teaching',
  'Mathematics',
  'Communication',
  'Graphic Design',
  'Canva',
  'Social Media',
  'Logistics',
  'Food Distribution',
  'Event Management',
  'Python',
  'Data Analysis',
  'Fundraising',
  'Marketing',
  'Content Writing',
];

const AVAILABILITY_OPTIONS = [
  'Weekends',
  'Weekday Evenings',
  'Weekday Mornings',
  'Flexible',
];

export const PostOpportunityPage: React.FC = () => {
  const { state, dispatch } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ngoName, setNgoName] = useState(state.activeNgo || 'Vidya Shiksha Foundation');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Web Development']);
  const [customSkill, setCustomSkill] = useState('');
  const [location, setLocation] = useState('Delhi');
  const [volunteersNeeded, setVolunteersNeeded] = useState(2);
  const [deadline, setDeadline] = useState('2026-11-20');
  const [urgency, setUrgency] = useState<UrgencyLevel>('High');
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(['Weekends']);
  const [timeCommitment, setTimeCommitment] = useState('6 hrs/week');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkill.trim()) return;
    const trimmed = customSkill.trim();
    if (!selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setCustomSkill('');
  };

  const toggleAvailability = (item: string) => {
    if (selectedAvailability.includes(item)) {
      setSelectedAvailability(selectedAvailability.filter((a) => a !== item));
    } else {
      setSelectedAvailability([...selectedAvailability, item]);
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Title is required';
    if (!description.trim()) err.description = 'Description is required';
    if (selectedSkills.length === 0) err.skills = 'Select at least one required skill';
    if (!location.trim()) err.location = 'Location is required';
    if (volunteersNeeded < 1) err.volunteersNeeded = 'Must need at least 1 volunteer';
    if (!deadline) err.deadline = 'Deadline date is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch({
      type: 'POST_OPPORTUNITY',
      payload: {
        ngoName,
        title: title.trim(),
        description: description.trim(),
        requiredSkills: selectedSkills,
        location: location.trim(),
        volunteersNeeded: Number(volunteersNeeded),
        deadline,
        urgency,
        timeCommitment: timeCommitment.trim() || '4 hrs/week',
        availability: selectedAvailability.length > 0 ? selectedAvailability : ['Flexible'],
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'ngo-dashboard' })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Instant AI Match Ready
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Create Volunteer Opportunity
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Specify technical skills, schedule, and location. Our AI engine will immediately rank the best candidate matches.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NGO Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={ngoName}
                onChange={(e) => setNgoName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
                placeholder="e.g. Vidya Shiksha Foundation"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Opportunity Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full text-xs rounded-xl border px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium ${
                  errors.title ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
                }`}
                placeholder="e.g. Website Development for Education NGO"
              />
              {errors.title && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mission Description & Objectives *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full text-xs rounded-xl border px-3 py-2.5 focus:outline-none focus:border-indigo-600 ${
                errors.description ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
              }`}
              placeholder="Outline the deliverables, volunteer expectations, and community beneficiaries..."
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Required Skills Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Required Skills (Multi-select) *
              </label>
              <span className="text-[11px] text-indigo-600 font-medium">
                {selectedSkills.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto">
              {COMMON_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {skill} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Custom Skill Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Or type a custom skill (e.g. Django, SEO)"
                className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-medium hover:bg-slate-700 transition cursor-pointer"
              >
                Add Skill
              </button>
            </div>
            {errors.skills && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.skills}
              </p>
            )}
          </div>

          {/* Location, Urgency, Volunteers Needed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium bg-white"
              >
                <option value="Delhi">Delhi</option>
                <option value="Noida">Noida</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium bg-white"
              >
                <option value="High">High Urgency</option>
                <option value="Medium">Medium Urgency</option>
                <option value="Low">Low Urgency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Volunteers Needed
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={volunteersNeeded}
                onChange={(e) => setVolunteersNeeded(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>
          </div>

          {/* Schedule Availability Requirements */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              When Work Happens (Schedule Alignment)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map((slot) => {
                const isSelected = selectedAvailability.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleAvailability(slot)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {slot} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commitment & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Weekly Time Commitment
              </label>
              <input
                type="text"
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
                placeholder="e.g. 5 hrs/week or 10 hrs total"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Application Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'ngo-dashboard' })}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Publish & Calculate AI Matches</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
