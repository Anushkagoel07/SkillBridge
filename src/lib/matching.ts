import { Volunteer, Opportunity, MatchResult } from '../types';

// Synonym clusters for partial skill credit (0.5 credit)
const SYNONYM_GROUPS: string[][] = [
  ['react', 'web development', 'frontend', 'typescript', 'javascript'],
  ['teaching', 'tutoring', 'mathematics', 'counselling', 'education'],
  ['graphic design', 'canva', 'ui design', 'figma', 'branding'],
  ['data analysis', 'python', 'statistics', 'sql', 'reporting'],
  ['logistics', 'event management', 'food distribution', 'operations'],
  ['fundraising', 'marketing', 'communication', 'social media', 'content writing'],
];

// NCR Delhi cluster
const NEARBY_CITIES: Record<string, string[]> = {
  delhi: ['noida', 'gurgaon', 'ghaziabad', 'faridabad'],
  noida: ['delhi', 'gurgaon', 'ghaziabad', 'faridabad'],
  gurgaon: ['delhi', 'noida', 'ghaziabad', 'faridabad'],
  ghaziabad: ['delhi', 'noida', 'gurgaon', 'faridabad'],
};

function areRelated(skillA: string, skillB: string): boolean {
  const a = skillA.toLowerCase().trim();
  const b = skillB.toLowerCase().trim();
  if (a === b) return true;
  for (const group of SYNONYM_GROUPS) {
    if (group.includes(a) && group.includes(b)) {
      return true;
    }
  }
  return false;
}

export function matchVolunteer(volunteer: Volunteer, opportunity: Opportunity): MatchResult {
  const required = opportunity?.requiredSkills || [];
  const volunteerSkills = volunteer?.skills || [];
  const oppAvailability = opportunity?.availability || [];
  const volAvailability = volunteer?.availability || [];
  const oppLocation = (opportunity?.location || '').toLowerCase().trim();
  const volLocation = (volunteer?.location || '').toLowerCase().trim();

  // 1. Skill Score Calculation (0 - 100)
  let skillScore = 0;
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  if (required.length === 0) {
    skillScore = 100;
  } else {
    let rawSkillPoints = 0;

    for (const req of required) {
      const exactMatch = volunteerSkills.find(
        (vs) => vs.toLowerCase().trim() === req.toLowerCase().trim()
      );

      if (exactMatch) {
        rawSkillPoints += 1.0;
        if (!matchingSkills.includes(exactMatch)) matchingSkills.push(exactMatch);
      } else {
        const relatedMatch = volunteerSkills.find((vs) => areRelated(vs, req));
        if (relatedMatch) {
          rawSkillPoints += 0.5;
          if (!matchingSkills.includes(`${relatedMatch} (related to ${req})`)) {
            matchingSkills.push(`${relatedMatch} (~${req})`);
          }
        } else {
          missingSkills.push(req);
        }
      }
    }

    const calculated = (rawSkillPoints / required.length) * 100;
    skillScore = Math.min(100, Math.max(0, Math.round(calculated)));
  }

  // 2. Availability Score Calculation (0 - 100)
  let availabilityScore = 0;
  let availabilityLabel = 'No schedule overlap';

  const volIsFlexible = volAvailability.some((a) => a.toLowerCase().includes('flexible'));
  const oppIsFlexible = oppAvailability.some((a) => a.toLowerCase().includes('flexible'));

  if (volIsFlexible || oppIsFlexible || oppAvailability.length === 0 || volAvailability.length === 0) {
    availabilityScore = 100;
    availabilityLabel = 'Fully flexible / matches schedule';
  } else {
    // Check direct overlap
    const directMatches = volAvailability.filter((vA) =>
      oppAvailability.some((oA) => oA.toLowerCase().trim() === vA.toLowerCase().trim())
    );

    if (directMatches.length > 0) {
      availabilityScore = 100;
      availabilityLabel = `Direct overlap (${directMatches.join(', ')})`;
    } else {
      // Partial keyword overlap e.g. "Weekend" in both
      const partialMatches = volAvailability.filter((vA) =>
        oppAvailability.some((oA) => {
          const v = vA.toLowerCase();
          const o = oA.toLowerCase();
          return (
            (v.includes('weekend') && o.includes('weekend')) ||
            (v.includes('evening') && o.includes('evening')) ||
            (v.includes('morning') && o.includes('morning')) ||
            (v.includes('weekday') && o.includes('weekday'))
          );
        })
      );

      if (partialMatches.length > 0) {
        availabilityScore = 50;
        availabilityLabel = `Partial overlap (${partialMatches.join(', ')})`;
      } else {
        availabilityScore = 0;
        availabilityLabel = 'Conflicting availability times';
      }
    }
  }

  // 3. Location Score Calculation (0 - 100)
  let locationScore = 20;
  let locationLabel = `Different location (${volunteer.location || 'Unknown'})`;

  if (oppLocation === 'remote' || !oppLocation) {
    locationScore = 100;
    locationLabel = 'Remote compatible (100%)';
  } else if (volLocation === oppLocation) {
    locationScore = 100;
    locationLabel = `Same city: ${volunteer.location} (100%)`;
  } else if (NEARBY_CITIES[oppLocation]?.includes(volLocation)) {
    locationScore = 70;
    locationLabel = `Nearby metro area: ${volunteer.location} ↔ ${opportunity.location} (70%)`;
  } else {
    locationScore = 20;
    locationLabel = `Different region (${volunteer.location} vs ${opportunity.location})`;
  }

  // Total weighted score: 60% skills + 25% availability + 15% location
  const total = Math.min(
    100,
    Math.max(0, Math.round(0.6 * skillScore + 0.25 * availabilityScore + 0.15 * locationScore))
  );

  // Generate transparent human-readable explanation
  let explanation = '';
  const skillCountText =
    required.length > 0
      ? `Matches ${matchingSkills.length} of ${required.length} required skills`
      : 'Open to all skillsets';

  const availText =
    availabilityScore === 100
      ? 'has complete schedule alignment'
      : availabilityScore >= 50
      ? 'has partial time overlap'
      : 'has schedule mismatch';

  const locText =
    locationScore === 100
      ? oppLocation === 'remote'
        ? 'can contribute remotely'
        : `is located directly in ${opportunity.location}`
      : locationScore >= 70
      ? `is nearby in ${volunteer.location}`
      : `is based in ${volunteer.location}`;

  explanation = `${skillCountText}, ${availText}, and ${locText}.`;

  return {
    total,
    skillScore,
    availabilityScore,
    locationScore,
    matchingSkills,
    missingSkills,
    explanation,
    availabilityLabel,
    locationLabel,
  };
}

export function rankVolunteers(
  opportunity: Opportunity,
  volunteers: Volunteer[]
): { volunteer: Volunteer; match: MatchResult }[] {
  if (!opportunity || !volunteers) return [];
  return volunteers
    .map((v) => ({
      volunteer: v,
      match: matchVolunteer(v, opportunity),
    }))
    .sort((a, b) => b.match.total - a.match.total);
}
