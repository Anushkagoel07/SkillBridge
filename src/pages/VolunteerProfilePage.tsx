import React, { useState, useEffect } from 'react';
import { useApp } from '../state/AppContext';
import { 
  User, 
  Save, 
  Sparkles, 
  Plus, 
  X, 
  MapPin, 
  Clock, 
  FileText,
  CheckCircle2
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React',
  'TypeScript',
  'Web Development',
  'UI Design',
  'Teaching',
  'Mathematics',
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
];

const AVAILABILITY_OPTIONS = [
  'Weekends',
  'Weekday Evenings',
  'Weekday Mornings',
  'Flexible',
];

export const VolunteerProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { volunteers, activeVolunteerId } = state;

  const currentVolunteer =
    volunteers.find((v) => v.id === activeVolunteerId) || volunteers[0];

  const [name, setName] = useState(currentVolunteer?.name || '');
  const [location, setLocation] = useState(currentVolunteer?.location || 'Delhi');
  const [bio, setBio] = useState(currentVolunteer?.bio || '');
  const [experience, setExperience] = useState(currentVolunteer?.experience || '');
  const [skills, setSkills] = useState<string[]>(currentVolunteer?.skills || []);
  const [availability, setAvailability] = useState<string[]>(
    currentVolunteer?.availability || ['Weekends']
  );
  const [newSkill, setNewSkill] = useState('');

  // Sync if active volunteer changes
  useEffect(() => {
    if (currentVolunteer) {
      setName(currentVolunteer.name);
      setLocation(currentVolunteer.location);
      setBio(currentVolunteer.bio);
      setExperience(currentVolunteer.experience);
      setSkills(currentVolunteer.skills);
      setAvailability(currentVolunteer.availability);
    }
  }, [currentVolunteer]);

  const toggleAvailability = (opt: string) => {
    if (availability.includes(opt)) {
      setAvailability(availability.filter((a) => a !== opt));
    } else {
      setAvailability([...availability, opt]);
    }
  };

  const removeSkill = (sToRemove: string) => {
    setSkills(skills.filter((s) => s !== sToRemove));
  };

  const addSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setNewSkill('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVolunteer) return;

    dispatch({
      type: 'UPDATE_VOLUNTEER_PROFILE',
      payload: {
        id: currentVolunteer.id,
        name: name.trim(),
        location: location.trim(),
        bio: bio.trim(),
        experience: experience.trim(),
        skills,
        availability,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            My Volunteer Profile & Skills Matrix
          </h1>
          <p className="text-xs text-slate-500">
            Keep your skills and schedule updated. Match rankings recalculate immediately.
          </p>
        </div>
        <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-200 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Live Ranking Engine
        </span>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Name and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current City / Base</label>
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
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Personal Impact Bio</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600"
            placeholder="Tell NGOs what social causes inspire you..."
          />
        </div>

        {/* Experience summary */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Professional / Community Experience
          </label>
          <textarea
            rows={2}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none focus:border-indigo-600"
            placeholder="Background, tools used, certifications..."
          />
        </div>

        {/* Skills Management */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Active Skill Portfolio ({skills.length})
            </label>
            <span className="text-[11px] text-slate-400">Click × to remove</span>
          </div>

          {/* Current skills */}
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 min-h-[50px]">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white shadow-xs"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="hover:text-rose-200 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <span className="text-xs text-slate-400">No skills added yet. Select below.</span>
            )}
          </div>

          {/* Add custom skill */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add another skill..."
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:border-indigo-600"
            />
            <button
              type="button"
              onClick={() => addSkill(newSkill)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Quick pick popular */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition cursor-pointer"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Availability Options */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Availability Windows
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY_OPTIONS.map((slot) => {
              const isSelected = availability.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleAvailability(slot)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
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

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md flex items-center gap-2 cursor-pointer transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Recalculate Matches</span>
          </button>
        </div>
      </form>
    </div>
  );
};
