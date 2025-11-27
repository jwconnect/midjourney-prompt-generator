// Prompt Types
export interface SavedPrompt {
  id: string;
  prompt: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  groupId: string | null;
  tags: string[];
  source: 'generated' | 'imported' | 'external';
  externalSource?: string;
  imageUrl?: string;
}

export interface PromptGroup {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface PromptHistory {
  prompts: SavedPrompt[];
  groups: PromptGroup[];
}

// External API Types
export interface LexicaImage {
  id: string;
  gallery: string;
  src: string;
  srcSmall: string;
  prompt: string;
  width: number;
  height: number;
  seed: string;
  grid: boolean;
  model: string;
  guidance?: number;
  promptid?: string;
  nsfw?: boolean;
}

export interface LexicaSearchResponse {
  images: LexicaImage[];
}

// i18n Types
export type Language = 'ko' | 'en';

export interface Translations {
  [key: string]: string;
}

// Highlight Types
export interface HighlightedPart {
  text: string;
  type: 'normal' | 'subject' | 'style' | 'mood' | 'parameter';
}

// Filter Types
export interface FilterOptions {
  searchQuery: string;
  groupId: string | null;
  favoritesOnly: boolean;
  sortBy: 'newest' | 'oldest' | 'alphabetical';
}

// Advanced Parameters Types
export interface AdvancedParams {
  stylize: number | null;      // 0-1000, default 100
  chaos: number | null;        // 0-100, default 0
  weird: number | null;        // 0-3000, default 0
  quality: number | null;      // 0.25, 0.5, 1
  seed: number | null;         // any number
  stop: number | null;         // 10-100
  tile: boolean;               // true/false
  negativePrompt: string;      // --no items
  sref: string;                // style reference code or "random"
  srefWeight: number | null;   // 0-1000, style weight
}

// Template Types
export interface PromptTemplate {
  id: string;
  name: string;
  style: string;
  mood: string;
  aspectRatio: string;
  version: string;
  advanced: AdvancedParams;
  createdAt: Date;
}

// Prompt Analysis Types
export interface PromptAnalysis {
  subject: string;
  styles: string[];
  moods: string[];
  parameters: Record<string, string>;
  modifiers: string[];
  negatives: string[];
}
