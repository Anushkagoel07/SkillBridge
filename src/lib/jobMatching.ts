import { Job, CandidateProfile, JobMatchResult } from '../jobTypes';

// Related skill clusters for partial credit (0.5)
const JOB_RELATED_CLUSTERS: string[][] = [
  ['react', 'javascript', 'typescript', 'frontend', 'html', 'css', 'tailwind', 'next.js', 'vue.js'],
  ['node.js', 'express', 'backend', 'sql', 'mongodb', 'postgresql', 'fastapi', 'python', 'rest api'],
  ['machine learning', 'python', 'deep learning', 'pytorch', 'tensorflow', 'pandas', 'nlp', 'data analysis'],
  ['data analysis', 'sql', 'excel', 'power bi', 'tableau', 'python', 'statistics'],
  ['ui design', 'ux design', 'figma', 'wireframing', 'prototyping', 'graphic design', 'canva'],
  ['graphic design', 'photoshop', 'illustrator', 'canva', 'ui design', 'social media'],
  ['digital marketing', 'seo', 'social media', 'content writing', 'google analytics', 'marketing'],
  ['docker', 'kubernetes', 'aws', 'linux', 'bash', 'ci/cd', 'terraform', 'cloud'],
];

// Nearby city map (NCR)
const NEARBY_CITIES: Record<string, string[]> = {
  delhi: ['noida', 'gurgaon', 'ghaziabad', 'faridabad'],
  noida: ['delhi', 'gurgaon', 'ghaziabad', 'faridabad'],
  gurgaon: ['delhi', 'noida', 'ghaziabad', 'faridabad'],
  ghaziabad: ['delhi', 'noida', 'gurgaon', 'faridabad'],
};

function normalizeSkill(s: string): string {
  const lower = s.toLowerCase().trim();
  if (lower === 'js') return 'javascript';
  if (lower === 'ts') return 'typescript';
  if (lower === 'reactjs' || lower === 'react.js') return 'react';
  if (lower === 'nodejs' || lower === 'node') return 'node.js';
  if (lower === 'py') return 'python';
  if (lower === 'ml') return 'machine learning';
  if (lower === 'dsa') return 'data structures';
  return lower;
}

function areSkillsRelated(skillA: string, skillB: string): boolean {
  const a = normalizeSkill(skillA);
  const b = normalizeSkill(skillB);
  if (a === b) return true;
  for (const cluster of JOB_RELATED_CLUSTERS) {
    if (cluster.includes(a) && cluster.includes(b)) {
      return true;
    }
  }
  return false;
}

export function matchJob(profile: CandidateProfile | null | undefined, job: Job): JobMatchResult {
  const candidateSkills = profile?.skills || [];
  const reqSkills = job.requiredSkills || [];
  const prefSkills = job.preferredSkills || [];
  const candLocation = (profile?.location || '').toLowerCase().trim();
  const jobLocation = (job.location || '').toLowerCase().trim();
  const candExp = profile?.yearsOfExperience ?? 0;

  // 1. Required Skills Score (70% weight)
  let requiredScore = 0;
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];

  if (reqSkills.length === 0) {
    requiredScore = 100;
  } else if (candidateSkills.length === 0) {
    requiredScore = 0;
    missingRequired.push(...reqSkills);
  } else {
    let reqPoints = 0;
    for (const req of reqSkills) {
      const normReq = normalizeSkill(req);
      const exactMatch = candidateSkills.find(
        (cs) => normalizeSkill(cs) === normReq
      );

      if (exactMatch) {
        reqPoints += 1.0;
        matchedRequired.push(exactMatch);
      } else {
        const related = candidateSkills.find((cs) => areSkillsRelated(cs, req));
        if (related) {
          reqPoints += 0.5;
          matchedRequired.push(`${related} (~${req})`);
        } else {
          missingRequired.push(req);
        }
      }
    }
    requiredScore = Math.min(100, Math.max(0, Math.round((reqPoints / reqSkills.length) * 100)));
  }

  // 2. Preferred Skills Score (15% weight)
  let preferredScore = 100;
  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];

  if (prefSkills.length > 0) {
    if (candidateSkills.length === 0) {
      preferredScore = 0;
      missingPreferred.push(...prefSkills);
    } else {
      let prefPoints = 0;
      for (const pref of prefSkills) {
        const normPref = normalizeSkill(pref);
        const exact = candidateSkills.find((cs) => normalizeSkill(cs) === normPref);
        if (exact) {
          prefPoints += 1.0;
          matchedPreferred.push(exact);
        } else {
          const related = candidateSkills.find((cs) => areSkillsRelated(cs, pref));
          if (related) {
            prefPoints += 0.5;
            matchedPreferred.push(`${related} (~${pref})`);
          } else {
            missingPreferred.push(pref);
          }
        }
      }
      preferredScore = Math.min(100, Math.max(0, Math.round((prefPoints / prefSkills.length) * 100)));
    }
  }

  // 3. Experience Compatibility (10% weight)
  let experienceScore = 50;
  let experienceLabel = 'Not specified';

  if (job.type === 'Internship' || job.minYears === 0) {
    experienceScore = 100;
    experienceLabel = 'Freshers and students eligible (100% fit)';
  } else if (profile?.yearsOfExperience === undefined) {
    experienceScore = 50;
    experienceLabel = 'Experience not specified in candidate profile (50%)';
  } else if (candExp >= job.minYears && candExp <= job.maxYears + 1) {
    experienceScore = 100;
    experienceLabel = `${candExp} year(s) matches the ${job.experienceRequired} target (100% fit)`;
  } else if (candExp === job.minYears - 1) {
    experienceScore = 60;
    experienceLabel = `${candExp} year(s) is 1 year below target ${job.experienceRequired} (60% fit)`;
  } else if (candExp < job.minYears) {
    experienceScore = 30;
    experienceLabel = `${candExp} year(s) is below required ${job.experienceRequired} (30% fit)`;
  } else {
    // Overqualified
    experienceScore = 80;
    experienceLabel = `${candExp} year(s) exceeds target range ${job.experienceRequired} (80% fit)`;
  }

  // 4. Location & Work Mode Compatibility (5% weight)
  let locationScore = 20;
  let locationLabel = `Location mismatch (${profile?.location || 'Unknown'} vs ${job.location})`;

  if (job.workMode === 'Remote' || jobLocation === 'remote') {
    locationScore = 100;
    locationLabel = 'Remote role — compatible from any location (100%)';
  } else if (candLocation && candLocation === jobLocation) {
    locationScore = 100;
    locationLabel = `Same city: ${job.location} (${job.workMode}) (100%)`;
  } else if (candLocation && NEARBY_CITIES[jobLocation]?.includes(candLocation)) {
    locationScore = 70;
    locationLabel = `Nearby metro area: ${profile?.location} ↔ ${job.location} (70%)`;
  } else {
    locationScore = 20;
    locationLabel = `Different region (${profile?.location || 'Unknown'} vs ${job.location})`;
  }

  // Bonus if candidate preferred work mode matches job work mode
  if (profile?.preferredWorkMode && profile.preferredWorkMode === job.workMode) {
    locationScore = Math.min(100, locationScore + 10);
  }

  // Overall Total: 70% required + 15% preferred + 10% exp + 5% loc
  const total = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        0.70 * requiredScore +
        0.15 * preferredScore +
        0.10 * experienceScore +
        0.05 * locationScore
      )
    )
  );

  // Generate plain-language transparent explanation
  let explanation = '';
  if (candidateSkills.length === 0) {
    explanation = 'Add skills to your candidate profile to compute compatibility.';
  } else {
    const reqStr = `You match ${matchedRequired.length} of ${reqSkills.length} required skills (${matchedRequired.slice(0, 3).join(', ')}${matchedRequired.length > 3 ? '...' : ''}).`;
    const missStr = missingRequired.length > 0 ? ` Missing: ${missingRequired.slice(0, 2).join(', ')}.` : '';
    const expStr = ` Your ${candExp} year(s) of experience ${candExp >= job.minYears ? 'fits' : 'is near'} the ${job.experienceRequired} requirement.`;
    explanation = `${reqStr}${missStr}${expStr}`;
  }

  return {
    total,
    requiredScore,
    preferredScore,
    experienceScore,
    locationScore,
    matchedRequired,
    matchedPreferred,
    missingRequired,
    missingPreferred,
    experienceLabel,
    locationLabel,
    explanation,
  };
}
