import type { LexicaSearchResponse, LexicaImage } from '@/types';

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
