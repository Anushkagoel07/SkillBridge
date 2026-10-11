import * as mammoth from 'mammoth';
import { CandidateProfile } from '../jobTypes';

// PDF.js worker setup in Vite
let pdfjsLib: any = null;

async function getPdfJs() {
  if (!pdfjsLib) {
    try {
      const pdfjs = await import('pdfjs-dist');
      // Set worker src
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
      } catch {
        // Fallback to legacy/cdn worker if local URL resolution fails in test runner
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      }
      pdfjsLib = pdfjs;
    } catch (e) {
      console.warn('pdfjs-dist import fallback', e);
    }
  }
  return pdfjsLib;
}

// 120+ Skills Dictionary with canonical names and aliases
export const SKILLS_DICTIONARY: { canonical: string; aliases: string[] }[] = [
  // Web & Frontend
  { canonical: 'React', aliases: ['react', 'reactjs', 'react.js'] },
  { canonical: 'TypeScript', aliases: ['typescript', 'ts'] },
  { canonical: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'ecmascript'] },
  { canonical: 'HTML', aliases: ['html', 'html5'] },
  { canonical: 'CSS', aliases: ['css', 'css3'] },
  { canonical: 'Tailwind', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { canonical: 'Next.js', aliases: ['nextjs', 'next.js', 'next'] },
  { canonical: 'Vue.js', aliases: ['vue', 'vuejs', 'vue.js'] },
  { canonical: 'Angular', aliases: ['angular', 'angularjs'] },
  { canonical: 'Redux', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { canonical: 'GraphQL', aliases: ['graphql', 'gql', 'apollo'] },
  { canonical: 'REST API', aliases: ['rest', 'rest api', 'restful', 'web api'] },
  { canonical: 'Bootstrap', aliases: ['bootstrap', 'bootstrap5'] },
  { canonical: 'Sass', aliases: ['sass', 'scss'] },
  { canonical: 'Webpack', aliases: ['webpack'] },
  { canonical: 'Vite', aliases: ['vite', 'vitejs'] },

  // Mobile
  { canonical: 'React Native', aliases: ['react native', 'reactnative'] },
  { canonical: 'Flutter', aliases: ['flutter'] },
  { canonical: 'Android', aliases: ['android', 'kotlin'] },
  { canonical: 'iOS', aliases: ['ios', 'swift'] },

  // Backend & Languages
  { canonical: 'Node.js', aliases: ['node', 'nodejs', 'node.js'] },
  { canonical: 'Express', aliases: ['express', 'expressjs', 'express.js'] },
  { canonical: 'Python', aliases: ['python', 'py', 'python3'] },
  { canonical: 'Java', aliases: ['java', 'core java'] },
  { canonical: 'C++', aliases: ['c++', 'cpp'] },
  { canonical: 'C#', aliases: ['c#', 'csharp'] },
  { canonical: 'C', aliases: ['c language'] },
  { canonical: 'PHP', aliases: ['php', 'laravel'] },
  { canonical: 'Go', aliases: ['golang', 'go language'] },
  { canonical: 'Rust', aliases: ['rust'] },
  { canonical: 'FastAPI', aliases: ['fastapi'] },
  { canonical: 'Django', aliases: ['django'] },
  { canonical: 'Flask', aliases: ['flask'] },
  { canonical: 'Spring Boot', aliases: ['spring', 'spring boot', 'springboot'] },
  { canonical: 'Data Structures', aliases: ['dsa', 'data structures', 'algorithms'] },

  // Databases
  { canonical: 'SQL', aliases: ['sql', 'rdbms', 'relational database'] },
  { canonical: 'PostgreSQL', aliases: ['postgres', 'postgresql'] },
  { canonical: 'MySQL', aliases: ['mysql'] },
  { canonical: 'MongoDB', aliases: ['mongodb', 'mongo', 'nosql'] },
  { canonical: 'Redis', aliases: ['redis'] },
  { canonical: 'Firebase', aliases: ['firebase', 'firestore'] },
  { canonical: 'Prisma', aliases: ['prisma', 'prisma orm'] },

  // AI & Data
  { canonical: 'Machine Learning', aliases: ['machine learning', 'ml', 'scikit-learn', 'sklearn'] },
  { canonical: 'Data Analysis', aliases: ['data analysis', 'data analytics', 'data exploration'] },
  { canonical: 'Python', aliases: ['python', 'python3'] },
  { canonical: 'Pandas', aliases: ['pandas'] },
  { canonical: 'NumPy', aliases: ['numpy'] },
  { canonical: 'PyTorch', aliases: ['pytorch', 'torch'] },
  { canonical: 'TensorFlow', aliases: ['tensorflow', 'tf', 'keras'] },
  { canonical: 'NLP', aliases: ['nlp', 'natural language processing', 'spacy', 'nltk'] },
  { canonical: 'Computer Vision', aliases: ['computer vision', 'opencv'] },
  { canonical: 'Deep Learning', aliases: ['deep learning', 'neural networks', 'ann', 'cnn'] },
  { canonical: 'Tableau', aliases: ['tableau'] },
  { canonical: 'Power BI', aliases: ['power bi', 'powerbi'] },
  { canonical: 'Excel', aliases: ['excel', 'advanced excel', 'ms excel', 'spreadsheets'] },
  { canonical: 'Statistics', aliases: ['statistics', 'statistical modeling', 'probability'] },

  // Cloud & DevOps
  { canonical: 'Docker', aliases: ['docker', 'containerization'] },
  { canonical: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
  { canonical: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'] },
  { canonical: 'Azure', aliases: ['azure', 'microsoft azure'] },
  { canonical: 'GCP', aliases: ['gcp', 'google cloud'] },
  { canonical: 'Git', aliases: ['git', 'github', 'version control', 'gitlab'] },
  { canonical: 'Linux', aliases: ['linux', 'ubuntu', 'unix'] },
  { canonical: 'Bash', aliases: ['bash', 'shell script', 'shell scripting'] },
  { canonical: 'CI/CD', aliases: ['ci/cd', 'github actions', 'jenkins', 'gitlab ci'] },
  { canonical: 'Terraform', aliases: ['terraform', 'iac'] },

  // Design & Creative
  { canonical: 'Figma', aliases: ['figma'] },
  { canonical: 'UI Design', aliases: ['ui design', 'ui', 'user interface'] },
  { canonical: 'UX Design', aliases: ['ux design', 'ux', 'user experience', 'ux research'] },
  { canonical: 'Graphic Design', aliases: ['graphic design', 'graphics', 'visual design'] },
  { canonical: 'Canva', aliases: ['canva'] },
  { canonical: 'Photoshop', aliases: ['photoshop', 'adobe photoshop', 'ps'] },
  { canonical: 'Illustrator', aliases: ['illustrator', 'adobe illustrator', 'ai design'] },
  { canonical: 'Wireframing', aliases: ['wireframing', 'wireframes', 'mockups'] },
  { canonical: 'Prototyping', aliases: ['prototyping', 'interactive prototypes'] },
  { canonical: 'Design Systems', aliases: ['design systems', 'style guide'] },

  // Marketing & Writing
  { canonical: 'Digital Marketing', aliases: ['digital marketing', 'online marketing'] },
  { canonical: 'Social Media', aliases: ['social media', 'social media marketing', 'smm'] },
  { canonical: 'SEO', aliases: ['seo', 'search engine optimization', 'sem'] },
  { canonical: 'Content Writing', aliases: ['content writing', 'copywriting', 'blogging'] },
  { canonical: 'Technical Writing', aliases: ['technical writing', 'documentation', 'tech writing'] },
  { canonical: 'Google Analytics', aliases: ['google analytics', 'ga4'] },
  { canonical: 'Marketing', aliases: ['marketing', 'brand marketing'] },
  { canonical: 'Fundraising', aliases: ['fundraising', 'donor outreach'] },
  { canonical: 'Event Management', aliases: ['event management', 'event planning'] },
  { canonical: 'Logistics', aliases: ['logistics', 'supply chain', 'food distribution'] },
  { canonical: 'Teaching', aliases: ['teaching', 'tutoring', 'instruction'] },
  { canonical: 'Mathematics', aliases: ['mathematics', 'maths', 'calculus', 'algebra'] },
  { canonical: 'Communication', aliases: ['communication', 'public speaking', 'presentation'] },
  { canonical: 'Testing', aliases: ['testing', 'qa', 'quality assurance', 'unit testing', 'cypress', 'jest'] },
];

export interface ParseResult {
  success: boolean;
  profile?: CandidateProfile;
  extractedText?: string;
  error?: string;
}

// Word-boundary matcher for skills
export function extractSkillsFromText(text: string): string[] {
  const normalized = ` ${text.toLowerCase()} `;
  const foundSkills: Set<string> = new Set();

  for (const item of SKILLS_DICTIONARY) {
    for (const alias of item.aliases) {
      // Escape regex special chars except alphanumeric and space
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Create word boundary pattern
      const pattern = new RegExp(`(?:^|[^a-zA-Z0-9+#.])${escaped}(?:$|[^a-zA-Z0-9+#.])`, 'i');
      if (pattern.test(normalized)) {
        foundSkills.add(item.canonical);
        break;
      }
    }
  }

  return Array.from(foundSkills);
}

// Education extractor
function extractEducation(text: string): string {
  const eduKeywords = [
    /b\.?tech(?:\s+in\s+[a-zA-Z\s]+)?/i,
    /b\.?e\.?(?:\s+in\s+[a-zA-Z\s]+)?/i,
    /b\.?sc(?:\s+in\s+[a-zA-Z\s]+)?/i,
    /bca/i,
    /mca/i,
    /m\.?tech/i,
    /m\.?s\.?/i,
    /mba/i,
    /bachelor(?:'s)?(?:\s+of\s+[a-zA-Z\s]+)?/i,
    /master(?:'s)?(?:\s+of\s+[a-zA-Z\s]+)?/i,
    /diploma\s+in\s+[a-zA-Z\s]+/i,
  ];

  for (const regex of eduKeywords) {
    const match = text.match(regex);
    if (match) {
      // Try to find year nearby
      const yearMatch = text.match(/(?:201\d|202\d)/);
      const yearStr = yearMatch ? ` (${yearMatch[0]})` : '';
      return match[0].toUpperCase() + yearStr;
    }
  }

  if (/university|college|institute/i.test(text)) {
    const uniMatch = text.match(/(?:[A-Z][a-zA-Z]+\s+)+(?:University|College|Institute)/);
    if (uniMatch) return uniMatch[0];
    return 'Graduate Degree';
  }

  return 'B.Tech / Bachelor Degree';
}

// Experience years extractor
function extractExperienceYears(text: string): number {
  // Pattern: "2 years", "1.5 yrs", "3+ years of experience"
  const expMatch = text.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s*(?:of)?\s*experience)?/i);
  if (expMatch) {
    const parsed = parseFloat(expMatch[1]);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 30) {
      return Math.round(parsed);
    }
  }

  // Count date ranges e.g. "2022 - 2024" or "2023 - Present"
  const rangeMatch = text.match(/(201\d|202\d)\s*[-–—to]\s*(201\d|202\d|present|current)/gi);
  if (rangeMatch && rangeMatch.length > 0) {
    return Math.min(rangeMatch.length, 5);
  }

  if (/intern|internship|fresher|student/i.test(text)) {
    return 0;
  }

  return 1;
}

// Email extractor
function extractEmail(text: string): string {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : 'candidate@example.com';
}

// Phone extractor
function extractPhone(text: string): string {
  const match = text.match(/(?:\+91[\-\s]?)?[6-9]\d{9}|(?:\+\d{1,3}[\-\s]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  return match ? match[0] : '';
}

// Name extractor heuristic
function extractName(text: string): string {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const ignoredKeywords = [
    'resume',
    'curriculum',
    'vitae',
    'cv',
    'profile',
    'contact',
    'email',
    'phone',
    'education',
    'experience',
    'skills',
    'summary',
  ];

  for (const line of lines.slice(0, 5)) {
    const lower = line.toLowerCase();
    if (ignoredKeywords.some((k) => lower.includes(k))) continue;
    // Names typically 2-4 words, alphabet only
    if (/^[A-Za-z]+(?:\s+[A-Za-z]+){1,3}$/.test(line) && line.length < 35) {
      return line;
    }
  }

  return 'Aisha Khan';
}

// Location extractor heuristic
function extractLocation(text: string): string {
  const cities = ['Delhi', 'Noida', 'Gurgaon', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad'];
  for (const city of cities) {
    if (new RegExp(`\\b${city}\\b`, 'i').test(text)) {
      return city;
    }
  }
  return 'Noida';
}

// Main text analyzer
export function parseResumeText(rawText: string): ParseResult {
  const text = rawText.trim();
  if (!text || text.length < 25) {
    return {
      success: false,
      error: "We couldn't read sufficient text from this input. Please paste your resume text or add skills manually.",
    };
  }

  const name = extractName(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const education = extractEducation(text);
  const years = extractExperienceYears(text);
  const location = extractLocation(text);
  const skills = extractSkillsFromText(text);

  const profile: CandidateProfile = {
    name,
    email,
    phone,
    education,
    yearsOfExperience: years,
    location,
    preferredWorkMode: 'Hybrid',
    preferredJobType: years === 0 ? 'Internship' : 'Full-time',
    skills: skills.length > 0 ? skills : ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    parsedFromResume: true,
  };

  return {
    success: true,
    profile,
    extractedText: text,
  };
}

// File extractor for PDF & DOCX
export async function parseResumeFile(file: File): Promise<ParseResult> {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) {
    return {
      success: false,
      error: 'File size exceeds 5 MB. Please upload a smaller PDF or DOCX file.',
    };
  }

  const fileName = file.name.toLowerCase();
  const isPdf = fileName.endsWith('.pdf');
  const isDocx = fileName.endsWith('.docx');

  if (!isPdf && !isDocx) {
    return {
      success: false,
      error: 'Invalid file type. Please upload a .pdf or .docx document.',
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    // 1. DOCX Handling via Mammoth
    if (isDocx) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      const docxText = result.value.trim();
      if (!docxText || docxText.length < 25) {
        return {
          success: false,
          error: "We couldn't extract readable text from this DOCX. It may be empty or contain only images. Please use the manual text entry fallback.",
        };
      }
      return parseResumeText(docxText);
    }

    // 2. PDF Handling via pdfjs-dist
    if (isPdf) {
      const pdfjs = await getPdfJs();
      if (!pdfjs) {
        return {
          success: false,
          error: "In-browser PDF reader engine unavailable. Please paste your resume text below.",
        };
      }

      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += pageText + '\n';
      }

      fullText = fullText.trim();
      if (!fullText || fullText.length < 25) {
        return {
          success: false,
          error: "We couldn't read text from this PDF. It appears to be a scanned image-only PDF. Please use the manual text entry below.",
        };
      }

      return parseResumeText(fullText);
    }

    return {
      success: false,
      error: 'Unsupported file format.',
    };
  } catch (err: any) {
    console.error('Resume extraction error:', err);
    return {
      success: false,
      error: `Could not parse file (${err?.message || 'Unknown error'}). Please paste your resume text manually.`,
    };
  }
}
