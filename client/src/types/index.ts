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
