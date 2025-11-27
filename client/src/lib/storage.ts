import type { SavedPrompt, PromptGroup, PromptHistory, FilterOptions, PromptTemplate, AdvancedParams } from '@/types';

const STORAGE_KEY = 'midjourney-prompt-history';
const TEMPLATE_STORAGE_KEY = 'midjourney-prompt-templates';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getHistory(): PromptHistory {
  if (typeof window === 'undefined') {
    return { prompts: [], groups: [] };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { prompts: [], groups: [] };
  }

  try {
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    parsed.prompts = parsed.prompts.map((p: SavedPrompt) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
    parsed.groups = parsed.groups.map((g: PromptGroup) => ({
      ...g,
      createdAt: new Date(g.createdAt),
    }));
    return parsed;
  } catch {
    return { prompts: [], groups: [] };
  }
}

function saveHistory(history: PromptHistory): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// Prompt Operations
export function getAllPrompts(): SavedPrompt[] {
  return getHistory().prompts;
}

export function getPromptById(id: string): SavedPrompt | undefined {
  return getHistory().prompts.find(p => p.id === id);
}

export function savePrompt(promptData: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>): SavedPrompt {
  const history = getHistory();
  const now = new Date();

  const newPrompt: SavedPrompt = {
    ...promptData,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };

  history.prompts.unshift(newPrompt); // Add to beginning
  saveHistory(history);

  return newPrompt;
}

export function updatePrompt(id: string, updates: Partial<SavedPrompt>): SavedPrompt | null {
  const history = getHistory();
  const index = history.prompts.findIndex(p => p.id === id);

  if (index === -1) return null;

  history.prompts[index] = {
    ...history.prompts[index],
    ...updates,
    updatedAt: new Date(),
  };

  saveHistory(history);
  return history.prompts[index];
}

export function deletePrompt(id: string): boolean {
  const history = getHistory();
  const initialLength = history.prompts.length;
  history.prompts = history.prompts.filter(p => p.id !== id);

  if (history.prompts.length !== initialLength) {
    saveHistory(history);
    return true;
  }
  return false;
}

export function toggleFavorite(id: string): boolean | null {
  const history = getHistory();
  const prompt = history.prompts.find(p => p.id === id);

  if (!prompt) return null;

  prompt.isFavorite = !prompt.isFavorite;
  prompt.updatedAt = new Date();
  saveHistory(history);

  return prompt.isFavorite;
}

export function getFavoritePrompts(): SavedPrompt[] {
  return getHistory().prompts.filter(p => p.isFavorite);
}

export function getPromptsByGroup(groupId: string | null): SavedPrompt[] {
  return getHistory().prompts.filter(p => p.groupId === groupId);
}

export function movePromptToGroup(promptId: string, groupId: string | null): boolean {
  const history = getHistory();
  const prompt = history.prompts.find(p => p.id === promptId);

  if (!prompt) return false;

  prompt.groupId = groupId;
  prompt.updatedAt = new Date();
  saveHistory(history);

  return true;
}

// Group Operations
export function getAllGroups(): PromptGroup[] {
  return getHistory().groups;
}

export function createGroup(name: string, color: string): PromptGroup {
  const history = getHistory();

  const newGroup: PromptGroup = {
    id: generateId(),
    name,
    color,
    createdAt: new Date(),
  };

  history.groups.push(newGroup);
  saveHistory(history);

  return newGroup;
}

export function updateGroup(id: string, updates: Partial<Omit<PromptGroup, 'id' | 'createdAt'>>): PromptGroup | null {
  const history = getHistory();
  const index = history.groups.findIndex(g => g.id === id);

  if (index === -1) return null;

  history.groups[index] = {
    ...history.groups[index],
    ...updates,
  };

  saveHistory(history);
  return history.groups[index];
}

export function deleteGroup(id: string, movePromptsToUngrouped: boolean = true): boolean {
  const history = getHistory();
  const initialLength = history.groups.length;

  history.groups = history.groups.filter(g => g.id !== id);

  if (history.groups.length !== initialLength) {
    if (movePromptsToUngrouped) {
      // Move all prompts in this group to ungrouped
      history.prompts.forEach(p => {
        if (p.groupId === id) {
          p.groupId = null;
        }
      });
    }
    saveHistory(history);
    return true;
  }
  return false;
}

// Filter and Sort
export function filterPrompts(options: FilterOptions): SavedPrompt[] {
  let prompts = getHistory().prompts;

  // Filter by search query
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    prompts = prompts.filter(p =>
      p.prompt.toLowerCase().includes(query) ||
      p.title.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Filter by group
  if (options.groupId !== null) {
    prompts = prompts.filter(p => p.groupId === options.groupId);
  }

  // Filter by favorites
  if (options.favoritesOnly) {
    prompts = prompts.filter(p => p.isFavorite);
  }

  // Sort
  switch (options.sortBy) {
    case 'newest':
      prompts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case 'oldest':
      prompts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      break;
    case 'alphabetical':
      prompts.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return prompts;
}

// Export/Import
export function exportHistory(): string {
  return JSON.stringify(getHistory(), null, 2);
}

export function importHistory(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.prompts && data.groups) {
      saveHistory(data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Statistics
export function getStatistics() {
  const history = getHistory();
  return {
    totalPrompts: history.prompts.length,
    favoriteCount: history.prompts.filter(p => p.isFavorite).length,
    groupCount: history.groups.length,
    generatedCount: history.prompts.filter(p => p.source === 'generated').length,
    importedCount: history.prompts.filter(p => p.source === 'imported' || p.source === 'external').length,
  };
}

// Template Operations
function getTemplates(): PromptTemplate[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return parsed.map((t: PromptTemplate) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }));
  } catch {
    return [];
  }
}

function saveTemplates(templates: PromptTemplate[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
}

export function getAllTemplates(): PromptTemplate[] {
  return getTemplates();
}

export function saveTemplate(templateData: Omit<PromptTemplate, 'id' | 'createdAt'>): PromptTemplate {
  const templates = getTemplates();

  const newTemplate: PromptTemplate = {
    ...templateData,
    id: generateId(),
    createdAt: new Date(),
  };

  templates.unshift(newTemplate);
  saveTemplates(templates);

  return newTemplate;
}

export function deleteTemplate(id: string): boolean {
  const templates = getTemplates();
  const initialLength = templates.length;
  const filtered = templates.filter(t => t.id !== id);

  if (filtered.length !== initialLength) {
    saveTemplates(filtered);
    return true;
  }
  return false;
}

export function getDefaultAdvancedParams(): AdvancedParams {
  return {
    stylize: null,
    chaos: null,
    weird: null,
    quality: null,
    seed: null,
    stop: null,
    tile: false,
    negativePrompt: '',
    sref: '',
    srefWeight: null,
  };
}
