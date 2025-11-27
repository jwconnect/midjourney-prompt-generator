import type { LexicaSearchResponse, LexicaImage, PromptAnalysis, AdvancedParams } from '@/types';

// Lexica API - Free and public API for searching AI art prompts
const LEXICA_API_BASE = 'https://lexica.art/api/v1';

export async function searchLexicaPrompts(query: string): Promise<LexicaImage[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const response = await fetch(`${LEXICA_API_BASE}/search?q=${encodedQuery}`);

    if (!response.ok) {
      throw new Error(`Lexica API error: ${response.status}`);
    }

    const data: LexicaSearchResponse = await response.json();
    return data.images || [];
  } catch (error) {
    console.error('Error fetching from Lexica:', error);
    throw error;
  }
}

// Helper function to format Lexica prompt for Midjourney use
export function formatLexicaPromptForMidjourney(prompt: string, aspectRatio?: string, version?: string): string {
  let formattedPrompt = `/imagine prompt: ${prompt}`;

  if (aspectRatio && aspectRatio !== '1:1') {
    formattedPrompt += ` --ar ${aspectRatio}`;
  }

  if (version) {
    formattedPrompt += ` --v ${version}`;
  }

  return formattedPrompt;
}

// Extract keywords from a prompt for better searchability
export function extractKeywords(prompt: string): string[] {
  // Remove common AI prompt modifiers
  const modifiersToRemove = [
    /highly detailed/gi,
    /professional quality/gi,
    /8k resolution/gi,
    /4k resolution/gi,
    /ultra detailed/gi,
    /masterpiece/gi,
    /best quality/gi,
    /--ar \d+:\d+/gi,
    /--v \d+(\.\d+)?/gi,
    /--niji \d+/gi,
    /--style \w+/gi,
    /--q \d+/gi,
    /--s \d+/gi,
    /--c \d+/gi,
    /\/imagine prompt:/gi,
  ];

  let cleanedPrompt = prompt;
  modifiersToRemove.forEach(modifier => {
    cleanedPrompt = cleanedPrompt.replace(modifier, '');
  });

  // Split by commas and clean up
  const keywords = cleanedPrompt
    .split(/[,;]/)
    .map(k => k.trim())
    .filter(k => k.length > 2 && k.length < 50);

  return keywords;
}

// Parse prompt to identify different components
export interface ParsedPrompt {
  subject: string;
  styles: string[];
  moods: string[];
  parameters: { [key: string]: string };
  modifiers: string[];
}

export function parsePrompt(prompt: string): ParsedPrompt {
  const result: ParsedPrompt = {
    subject: '',
    styles: [],
    moods: [],
    parameters: {},
    modifiers: [],
  };

  // Extract parameters (--ar, --v, etc.)
  const paramRegex = /--(\w+)\s+([^\s-]+)/g;
  let match;
  let cleanPrompt = prompt;

  while ((match = paramRegex.exec(prompt)) !== null) {
    result.parameters[match[1]] = match[2];
    cleanPrompt = cleanPrompt.replace(match[0], '');
  }

  // Remove /imagine prompt:
  cleanPrompt = cleanPrompt.replace(/\/imagine prompt:\s*/i, '').trim();

  // Known style keywords
  const styleKeywords = [
    'photorealistic', 'oil painting', 'watercolor', 'digital art', '3d render',
    'anime', 'comic book', 'sketch', 'abstract', 'minimalist',
    'cyberpunk', 'steampunk', 'fantasy', 'sci-fi', 'vintage',
    'impressionist', 'surreal', 'baroque', 'art nouveau', 'pop art',
    'pixel art', 'low poly', 'vaporwave', 'gothic', 'retro'
  ];

  // Known mood keywords
  const moodKeywords = [
    'dramatic', 'peaceful', 'energetic', 'mysterious', 'joyful',
    'dark', 'bright', 'melancholic', 'epic', 'serene',
    'moody', 'cinematic', 'ethereal', 'dreamy', 'intense'
  ];

  // Quality modifiers
  const qualityModifiers = [
    'highly detailed', 'professional quality', '8k resolution', '4k',
    'ultra detailed', 'masterpiece', 'best quality', 'sharp focus',
    'intricate details', 'octane render', 'unreal engine'
  ];

  const parts = cleanPrompt.split(',').map(p => p.trim().toLowerCase());

  parts.forEach((part, index) => {
    const partLower = part.toLowerCase();

    // Check for styles
    if (styleKeywords.some(s => partLower.includes(s))) {
      result.styles.push(part);
    }
    // Check for moods
    else if (moodKeywords.some(m => partLower.includes(m))) {
      result.moods.push(part);
    }
    // Check for quality modifiers
    else if (qualityModifiers.some(q => partLower.includes(q))) {
      result.modifiers.push(part);
    }
    // First substantial part is likely the subject
    else if (index === 0 || (!result.subject && part.length > 10)) {
      result.subject = part;
    }
  });

  return result;
}

// Suggested search queries for inspiration
export const suggestedQueries = [
  'fantasy landscape',
  'cyberpunk city',
  'portrait photography',
  'abstract art',
  'anime character',
  'steampunk',
  'nature photography',
  'sci-fi spaceship',
  'medieval castle',
  'underwater scene',
  'neon lights',
  'surreal dreamscape',
  'minimalist design',
  'vintage poster',
  'character concept art',
];

// Random placeholder for search
export function getRandomSuggestion(): string {
  return suggestedQueries[Math.floor(Math.random() * suggestedQueries.length)];
}

// Advanced prompt analysis
export function analyzePromptAdvanced(prompt: string): PromptAnalysis {
  const result: PromptAnalysis = {
    subject: '',
    styles: [],
    moods: [],
    parameters: {},
    modifiers: [],
    negatives: [],
  };

  let workingPrompt = prompt;

  // Extract --no (negative prompt)
  const noMatch = workingPrompt.match(/--no\s+([^-]+?)(?=\s+--|$)/i);
  if (noMatch) {
    result.negatives = noMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    workingPrompt = workingPrompt.replace(noMatch[0], '');
  }

  // Extract all parameters
  const paramPatterns = [
    { regex: /--ar\s+(\d+:\d+)/gi, key: 'ar' },
    { regex: /--v\s+(\d+\.?\d*)/gi, key: 'v' },
    { regex: /--s\s+(\d+)/gi, key: 's' },
    { regex: /--stylize\s+(\d+)/gi, key: 'stylize' },
    { regex: /--c\s+(\d+)/gi, key: 'c' },
    { regex: /--chaos\s+(\d+)/gi, key: 'chaos' },
    { regex: /--q\s+([\d.]+)/gi, key: 'q' },
    { regex: /--quality\s+([\d.]+)/gi, key: 'quality' },
    { regex: /--weird\s+(\d+)/gi, key: 'weird' },
    { regex: /--seed\s+(\d+)/gi, key: 'seed' },
    { regex: /--stop\s+(\d+)/gi, key: 'stop' },
    { regex: /--sref\s+(\S+)/gi, key: 'sref' },
    { regex: /--sw\s+(\d+)/gi, key: 'sw' },
    { regex: /--cref\s+(\S+)/gi, key: 'cref' },
    { regex: /--cw\s+(\d+)/gi, key: 'cw' },
    { regex: /--tile/gi, key: 'tile' },
    { regex: /--niji\s*(\d*)/gi, key: 'niji' },
    { regex: /--iw\s+([\d.]+)/gi, key: 'iw' },
  ];

  paramPatterns.forEach(({ regex, key }) => {
    const match = workingPrompt.match(regex);
    if (match) {
      const fullMatch = match[0];
      const valueMatch = fullMatch.match(/[\d.:]+$|random$/i);
      result.parameters[key] = key === 'tile' ? 'true' : (valueMatch ? valueMatch[0] : 'true');
      workingPrompt = workingPrompt.replace(regex, '');
    }
  });

  // Remove /imagine prompt:
  workingPrompt = workingPrompt.replace(/\/imagine prompt:\s*/i, '').trim();

  // Known style keywords (expanded list)
  const styleKeywords = [
    'photorealistic', 'oil painting', 'watercolor', 'digital art', '3d render',
    'anime', 'comic book', 'sketch', 'abstract', 'minimalist',
    'cyberpunk', 'steampunk', 'fantasy', 'sci-fi', 'vintage',
    'impressionist', 'surreal', 'baroque', 'art nouveau', 'pop art',
    'pixel art', 'low poly', 'vaporwave', 'gothic', 'retro',
    'hyperrealistic', 'concept art', 'illustration', 'cartoon', 'manga',
    'line art', 'vector art', 'isometric', 'art deco', 'brutalist',
    'graffiti', 'stencil', 'collage', 'mosaic', 'woodcut',
    'pencil drawing', 'charcoal', 'pastel', 'acrylic', 'gouache',
    'cinematic', 'film still', 'portrait', 'landscape', 'macro',
  ];

  // Known mood keywords (expanded list)
  const moodKeywords = [
    'dramatic', 'peaceful', 'energetic', 'mysterious', 'joyful',
    'dark', 'bright', 'melancholic', 'epic', 'serene',
    'moody', 'cinematic', 'ethereal', 'dreamy', 'intense',
    'whimsical', 'haunting', 'nostalgic', 'vibrant', 'somber',
    'romantic', 'eerie', 'magical', 'futuristic', 'ancient',
    'cozy', 'cold', 'warm', 'atmospheric', 'gloomy',
  ];

  // Quality modifiers
  const qualityModifiers = [
    'highly detailed', 'professional quality', '8k resolution', '4k',
    'ultra detailed', 'masterpiece', 'best quality', 'sharp focus',
    'intricate details', 'octane render', 'unreal engine', 'ray tracing',
    'studio lighting', 'soft lighting', 'volumetric lighting', 'golden hour',
    'award winning', 'trending on artstation', 'featured on behance',
    'hdr', 'uhd', 'high resolution', 'intricate', 'elegant',
  ];

  const parts = workingPrompt.split(',').map(p => p.trim());

  parts.forEach((part, index) => {
    const partLower = part.toLowerCase();
    if (!partLower) return;

    // Check for styles
    const foundStyle = styleKeywords.find(s => partLower.includes(s));
    if (foundStyle) {
      result.styles.push(part);
      return;
    }

    // Check for moods
    const foundMood = moodKeywords.find(m => partLower.includes(m));
    if (foundMood) {
      result.moods.push(part);
      return;
    }

    // Check for quality modifiers
    const foundModifier = qualityModifiers.find(q => partLower.includes(q));
    if (foundModifier) {
      result.modifiers.push(part);
      return;
    }

    // First substantial part is likely the subject
    if (index === 0 || (!result.subject && part.length > 5)) {
      if (!result.subject) {
        result.subject = part;
      }
    }
  });

  return result;
}

// Convert analysis back to parameters
export function analysisToAdvancedParams(analysis: PromptAnalysis): Partial<AdvancedParams> {
  const params: Partial<AdvancedParams> = {};

  if (analysis.parameters.s || analysis.parameters.stylize) {
    params.stylize = parseInt(analysis.parameters.s || analysis.parameters.stylize);
  }
  if (analysis.parameters.c || analysis.parameters.chaos) {
    params.chaos = parseInt(analysis.parameters.c || analysis.parameters.chaos);
  }
  if (analysis.parameters.weird) {
    params.weird = parseInt(analysis.parameters.weird);
  }
  if (analysis.parameters.q || analysis.parameters.quality) {
    params.quality = parseFloat(analysis.parameters.q || analysis.parameters.quality);
  }
  if (analysis.parameters.seed) {
    params.seed = parseInt(analysis.parameters.seed);
  }
  if (analysis.parameters.stop) {
    params.stop = parseInt(analysis.parameters.stop);
  }
  if (analysis.parameters.tile) {
    params.tile = true;
  }
  if (analysis.parameters.sref) {
    params.sref = analysis.parameters.sref;
  }
  if (analysis.parameters.sw) {
    params.srefWeight = parseInt(analysis.parameters.sw);
  }
  if (analysis.negatives.length > 0) {
    params.negativePrompt = analysis.negatives.join(', ');
  }

  return params;
}

// Popular SREF codes for quick access
export const popularSrefCodes = [
  { code: '12345678', description: 'Cinematic' },
  { code: '87654321', description: 'Anime Style' },
  { code: '11111111', description: 'Vibrant Colors' },
  { code: '22222222', description: 'Dark Moody' },
  { code: '33333333', description: 'Watercolor' },
  { code: '44444444', description: 'Oil Painting' },
  { code: '55555555', description: 'Vintage Photo' },
  { code: '66666666', description: 'Neon Glow' },
  { code: 'random', description: 'Random Style' },
];
