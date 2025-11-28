import type { LexicaSearchResponse, LexicaImage, PromptAnalysis, AdvancedParams, CivitaiImage, CuratedPrompt } from '@/types';

// Lexica API - Free and public API for searching AI art prompts
const LEXICA_API_BASE = 'https://lexica.art/api/v1';

// Civitai API - Public API for AI-generated images
const CIVITAI_API_BASE = 'https://civitai.com/api/v1';

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

// Civitai API - Search images with prompts
export async function searchCivitaiImages(query: string, limit: number = 20): Promise<CivitaiImage[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const response = await fetch(`${CIVITAI_API_BASE}/images?prompt=${encodedQuery}&limit=${limit}&sort=Most Reactions`);

    if (!response.ok) {
      throw new Error(`Civitai API error: ${response.status}`);
    }

    const data = await response.json();
    return (data.items || []).map((item: { id: number; url: string; width: number; height: number; meta?: { prompt?: string; negativePrompt?: string; seed?: number; Model?: string } }) => ({
      id: String(item.id),
      url: item.url,
      width: item.width,
      height: item.height,
      prompt: item.meta?.prompt || '',
      negativePrompt: item.meta?.negativePrompt || '',
      seed: item.meta?.seed,
      model: item.meta?.Model || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching from Civitai:', error);
    throw error;
  }
}

// Curated Prompt Library by Category
export const curatedPromptCategories = [
  'fantasy',
  'portrait',
  'landscape',
  'scifi',
  'anime',
  'architecture',
  'abstract',
  'product',
  'character',
  'nature',
] as const;

export type PromptCategory = typeof curatedPromptCategories[number];

export const curatedPrompts: CuratedPrompt[] = [
  // Fantasy
  {
    id: 'fantasy-1',
    category: 'fantasy',
    prompt: 'An ethereal elven princess standing in a moonlit forest clearing, wearing a flowing silver gown adorned with glowing runes, surrounded by floating magical butterflies, cinematic lighting, highly detailed, fantasy art style',
    title: 'Elven Princess in Moonlit Forest',
    tags: ['elf', 'princess', 'forest', 'magical', 'fantasy'],
    aspectRatio: '2:3',
    suggestedParams: { stylize: 750, chaos: 15 }
  },
  {
    id: 'fantasy-2',
    category: 'fantasy',
    prompt: 'A massive ancient dragon perched atop a crystalline mountain peak, scales shimmering with iridescent colors, storm clouds gathering, lightning striking in the background, epic fantasy, detailed textures, volumetric lighting',
    title: 'Ancient Dragon on Crystal Peak',
    tags: ['dragon', 'mountain', 'epic', 'storm', 'fantasy'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 850, chaos: 20 }
  },
  {
    id: 'fantasy-3',
    category: 'fantasy',
    prompt: 'A mystical wizard library with floating books, spiraling staircases leading to infinity, celestial light streaming through stained glass windows, magical artifacts on ancient shelves, hyper detailed, atmospheric',
    title: 'Mystical Wizard Library',
    tags: ['wizard', 'library', 'books', 'magical', 'interior'],
    aspectRatio: '1:1',
    suggestedParams: { stylize: 600 }
  },
  {
    id: 'fantasy-4',
    category: 'fantasy',
    prompt: 'A enchanted underwater kingdom with merfolk swimming among coral palaces, bioluminescent sea creatures, rays of sunlight filtering through turquoise waters, fantastical architecture, dreamy atmosphere',
    title: 'Enchanted Underwater Kingdom',
    tags: ['underwater', 'mermaid', 'kingdom', 'coral', 'fantasy'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 700, weird: 250 }
  },

  // Portrait
  {
    id: 'portrait-1',
    category: 'portrait',
    prompt: 'Portrait of a cyberpunk woman with neon-lit cybernetic implants, holographic hair, rain-soaked city reflected in her eyes, Blade Runner aesthetic, cinematic portrait photography, dramatic lighting',
    title: 'Cyberpunk Woman Portrait',
    tags: ['cyberpunk', 'woman', 'neon', 'portrait', 'scifi'],
    aspectRatio: '2:3',
    suggestedParams: { stylize: 500 }
  },
  {
    id: 'portrait-2',
    category: 'portrait',
    prompt: 'Elegant renaissance nobleman portrait in the style of Rembrandt, golden hour lighting, rich velvet clothing, intricate lace collar, oil painting texture, museum quality, chiaroscuro lighting',
    title: 'Renaissance Nobleman',
    tags: ['renaissance', 'portrait', 'classical', 'oil painting', 'nobleman'],
    aspectRatio: '3:4',
    suggestedParams: { stylize: 800 }
  },
  {
    id: 'portrait-3',
    category: 'portrait',
    prompt: 'Ethereal beauty portrait, woman with flowers blooming from her hair, soft dreamy lighting, pastel colors, Art Nouveau influence, delicate features, botanical elements intertwined, magazine quality',
    title: 'Ethereal Flower Portrait',
    tags: ['flowers', 'beauty', 'ethereal', 'art nouveau', 'woman'],
    aspectRatio: '2:3',
    suggestedParams: { stylize: 650 }
  },
  {
    id: 'portrait-4',
    category: 'portrait',
    prompt: 'Weathered elderly fisherman portrait, deep wrinkles telling stories, sea-weathered skin, wise eyes, dramatic side lighting, documentary photography style, raw emotion, character study',
    title: 'Weathered Fisherman',
    tags: ['elderly', 'portrait', 'documentary', 'fisherman', 'character'],
    aspectRatio: '1:1',
    suggestedParams: { stylize: 300, quality: 1 }
  },

  // Landscape
  {
    id: 'landscape-1',
    category: 'landscape',
    prompt: 'Breathtaking alien planet landscape with multiple moons rising over purple crystalline mountains, bioluminescent vegetation, two suns setting on the horizon, science fiction environment, otherworldly beauty',
    title: 'Alien Planet Sunset',
    tags: ['alien', 'planet', 'landscape', 'scifi', 'sunset'],
    aspectRatio: '21:9',
    suggestedParams: { stylize: 850, chaos: 30 }
  },
  {
    id: 'landscape-2',
    category: 'landscape',
    prompt: 'Japanese zen garden in autumn, perfectly raked sand patterns, ancient maple trees with red leaves, stone lanterns, morning mist, golden hour light, peaceful atmosphere, highly detailed photography',
    title: 'Japanese Zen Garden Autumn',
    tags: ['japan', 'zen', 'garden', 'autumn', 'peaceful'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 400 }
  },
  {
    id: 'landscape-3',
    category: 'landscape',
    prompt: 'Majestic Norwegian fjord at golden hour, mirror-like water reflections, snow-capped mountains, tiny red fishing cabins, dramatic clouds, nature photography, National Geographic quality',
    title: 'Norwegian Fjord Golden Hour',
    tags: ['fjord', 'norway', 'landscape', 'nature', 'photography'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 350 }
  },
  {
    id: 'landscape-4',
    category: 'landscape',
    prompt: 'Surreal floating islands in the sky connected by ancient rope bridges, waterfalls cascading into clouds, lush vegetation, fantasy landscape, dreamlike atmosphere, impossible architecture',
    title: 'Floating Islands Fantasy',
    tags: ['floating', 'islands', 'fantasy', 'surreal', 'bridges'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 900, weird: 500 }
  },

  // Sci-Fi
  {
    id: 'scifi-1',
    category: 'scifi',
    prompt: 'Massive space station orbiting a gas giant, intricate mechanical details, ships docking, nebula backdrop, hard science fiction aesthetic, cinematic lighting, Syd Mead inspired design',
    title: 'Space Station Gas Giant',
    tags: ['space', 'station', 'scifi', 'nebula', 'mechanical'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 600 }
  },
  {
    id: 'scifi-2',
    category: 'scifi',
    prompt: 'Post-apocalyptic city reclaimed by nature, overgrown skyscrapers, deer walking through abandoned streets, dramatic cloudscape, The Last of Us aesthetic, environmental storytelling',
    title: 'Post-Apocalyptic Overgrown City',
    tags: ['post-apocalyptic', 'overgrown', 'city', 'nature', 'abandoned'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 550 }
  },
  {
    id: 'scifi-3',
    category: 'scifi',
    prompt: 'Sleek futuristic hoverbike racing through neon-lit megacity streets, motion blur, holographic advertisements, rain-slicked surfaces, Akira inspired, high speed chase scene',
    title: 'Futuristic Hoverbike Chase',
    tags: ['hoverbike', 'cyberpunk', 'racing', 'neon', 'megacity'],
    aspectRatio: '21:9',
    suggestedParams: { stylize: 700, chaos: 15 }
  },
  {
    id: 'scifi-4',
    category: 'scifi',
    prompt: 'Alien archaeological dig site on Mars, scientists in spacesuits uncovering ancient artifacts, Martian landscape, mysterious alien technology, realistic science fiction, documentary style',
    title: 'Mars Alien Archaeology',
    tags: ['mars', 'alien', 'archaeology', 'scifi', 'discovery'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 400 }
  },

  // Anime
  {
    id: 'anime-1',
    category: 'anime',
    prompt: 'Anime girl with long flowing blue hair in a field of sunflowers at sunset, school uniform, wind blowing, nostalgic summer atmosphere, Makoto Shinkai style, beautiful sky gradient',
    title: 'Anime Summer Sunflower Field',
    tags: ['anime', 'girl', 'sunflowers', 'summer', 'shinkai'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 600 },
    version: 'niji 6'
  },
  {
    id: 'anime-2',
    category: 'anime',
    prompt: 'Epic anime battle scene, samurai warrior in dynamic pose mid-slash, cherry blossoms exploding around, dramatic motion lines, intense expression, studio Ufotable quality animation',
    title: 'Anime Samurai Battle',
    tags: ['anime', 'samurai', 'battle', 'action', 'cherry blossoms'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 750, chaos: 10 },
    version: 'niji 6'
  },
  {
    id: 'anime-3',
    category: 'anime',
    prompt: 'Cozy anime room interior, cat sleeping on bed, warm afternoon sunlight, plants on windowsill, detailed background, slice of life aesthetic, Studio Ghibli inspired, peaceful mood',
    title: 'Cozy Anime Room with Cat',
    tags: ['anime', 'room', 'cozy', 'cat', 'ghibli'],
    aspectRatio: '4:3',
    suggestedParams: { stylize: 500 },
    version: 'niji 6'
  },
  {
    id: 'anime-4',
    category: 'anime',
    prompt: 'Dark fantasy anime villain, elaborate gothic armor, glowing red eyes, surrounded by shadows and dark magic, intimidating presence, detailed character design, dramatic backlight',
    title: 'Dark Fantasy Anime Villain',
    tags: ['anime', 'villain', 'dark fantasy', 'gothic', 'armor'],
    aspectRatio: '2:3',
    suggestedParams: { stylize: 800 },
    version: 'niji 6'
  },

  // Architecture
  {
    id: 'arch-1',
    category: 'architecture',
    prompt: 'Futuristic sustainable skyscraper with vertical gardens, biomimetic design, solar panels integrated seamlessly, green architecture, clear blue sky, architectural visualization, photorealistic render',
    title: 'Futuristic Green Skyscraper',
    tags: ['architecture', 'futuristic', 'sustainable', 'skyscraper', 'green'],
    aspectRatio: '9:16',
    suggestedParams: { stylize: 400 }
  },
  {
    id: 'arch-2',
    category: 'architecture',
    prompt: 'Ancient temple ruins at sunrise, moss-covered stones, shafts of golden light through broken roof, atmospheric fog, Indiana Jones aesthetic, architectural photography, sense of discovery',
    title: 'Ancient Temple Ruins',
    tags: ['temple', 'ruins', 'ancient', 'sunrise', 'atmospheric'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 550 }
  },
  {
    id: 'arch-3',
    category: 'architecture',
    prompt: 'Minimalist Japanese tea house interior, tatami floors, shoji screens, single ikebana arrangement, perfect natural lighting, zen aesthetic, architectural interior photography',
    title: 'Minimalist Japanese Tea House',
    tags: ['japanese', 'minimalist', 'interior', 'zen', 'tea house'],
    aspectRatio: '3:2',
    suggestedParams: { stylize: 300 }
  },
  {
    id: 'arch-4',
    category: 'architecture',
    prompt: 'Impossible Escher-inspired architecture, infinite staircases, non-euclidean geometry, surreal spaces, black and white, architectural paradox, mind-bending perspective',
    title: 'Escher Impossible Architecture',
    tags: ['escher', 'impossible', 'surreal', 'architecture', 'geometric'],
    aspectRatio: '1:1',
    suggestedParams: { stylize: 950, weird: 750 }
  },

  // Abstract
  {
    id: 'abstract-1',
    category: 'abstract',
    prompt: 'Fluid abstract art with liquid gold and deep ocean blue, metallic textures, marble effect, luxurious feeling, alcohol ink inspired, high contrast, gallery quality abstract',
    title: 'Liquid Gold Abstract',
    tags: ['abstract', 'gold', 'blue', 'fluid', 'luxury'],
    aspectRatio: '1:1',
    suggestedParams: { stylize: 1000, chaos: 50 }
  },
  {
    id: 'abstract-2',
    category: 'abstract',
    prompt: 'Geometric abstract composition, bold primary colors, Mondrian meets Kandinsky, clean lines and circles, suprematist influence, modern art museum piece, balanced asymmetry',
    title: 'Geometric Primary Colors',
    tags: ['abstract', 'geometric', 'mondrian', 'colors', 'modern art'],
    aspectRatio: '1:1',
    suggestedParams: { stylize: 800 }
  },
  {
    id: 'abstract-3',
    category: 'abstract',
    prompt: 'Cosmic nebula abstract, swirling galaxies of color, stardust particles, deep space feeling, macro and micro simultaneously, psychedelic yet elegant, infinite depth',
    title: 'Cosmic Nebula Abstract',
    tags: ['abstract', 'cosmic', 'nebula', 'space', 'psychedelic'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 900, weird: 1000 }
  },
  {
    id: 'abstract-4',
    category: 'abstract',
    prompt: 'Organic abstract forms, flowing biomorphic shapes, soft gradients, calming earth tones, nature-inspired abstraction, meditation room art, peaceful energy',
    title: 'Organic Biomorphic Abstract',
    tags: ['abstract', 'organic', 'biomorphic', 'calm', 'nature'],
    aspectRatio: '3:4',
    suggestedParams: { stylize: 600, weird: 200 }
  },

  // Product
  {
    id: 'product-1',
    category: 'product',
    prompt: 'Luxury perfume bottle floating with rose petals, water droplets, pink gradient background, product photography, soft studio lighting, high-end advertising, beauty shot',
    title: 'Luxury Perfume Product Shot',
    tags: ['product', 'perfume', 'luxury', 'beauty', 'advertising'],
    aspectRatio: '4:5',
    suggestedParams: { stylize: 350 }
  },
  {
    id: 'product-2',
    category: 'product',
    prompt: 'Sleek smartwatch product photography, floating in space with holographic UI elements, dark background, dramatic rim lighting, technology product, Apple style marketing',
    title: 'Smartwatch Tech Product',
    tags: ['product', 'smartwatch', 'technology', 'apple', 'marketing'],
    aspectRatio: '1:1',
    suggestedParams: { stylize: 300 }
  },
  {
    id: 'product-3',
    category: 'product',
    prompt: 'Artisan chocolate truffles arranged on marble surface, gold dust, dark moody lighting, food photography, gourmet presentation, advertisement quality, macro detail',
    title: 'Artisan Chocolate Truffles',
    tags: ['product', 'food', 'chocolate', 'gourmet', 'luxury'],
    aspectRatio: '4:3',
    suggestedParams: { stylize: 400 }
  },
  {
    id: 'product-4',
    category: 'product',
    prompt: 'Modern minimalist furniture, Scandinavian design chair in white room, natural wood and soft fabric, clean aesthetic, interior design magazine shot, lifestyle product',
    title: 'Scandinavian Design Chair',
    tags: ['product', 'furniture', 'scandinavian', 'minimalist', 'interior'],
    aspectRatio: '4:5',
    suggestedParams: { stylize: 250 }
  },

  // Character Design
  {
    id: 'character-1',
    category: 'character',
    prompt: 'Steampunk inventor character design, Victorian clothing with brass goggles and mechanical arm, detailed costume design, full body turnaround potential, character concept art, game ready',
    title: 'Steampunk Inventor Character',
    tags: ['character', 'steampunk', 'inventor', 'victorian', 'concept art'],
    aspectRatio: '2:3',
    suggestedParams: { stylize: 600 }
  },
  {
    id: 'character-2',
    category: 'character',
    prompt: 'Cute fantasy creature mascot design, round fluffy body, big expressive eyes, tiny wings, pastel colors, kawaii style, perfect for merchandise, character sheet potential',
    title: 'Cute Fantasy Mascot',
    tags: ['character', 'mascot', 'cute', 'fantasy', 'kawaii'],
    aspectRatio: '1:1',
    suggestedParams: { stylize: 500 }
  },
  {
    id: 'character-3',
    category: 'character',
    prompt: 'Battle-scarred orc warrior character, tribal tattoos, massive bone armor, intimidating presence, fantasy RPG design, detailed textures, character portrait for game',
    title: 'Orc Warrior Character',
    tags: ['character', 'orc', 'warrior', 'fantasy', 'rpg'],
    aspectRatio: '2:3',
    suggestedParams: { stylize: 700 }
  },
  {
    id: 'character-4',
    category: 'character',
    prompt: 'Mysterious masked assassin character, sleek black outfit, glowing energy daggers, dynamic pose, action game protagonist, detailed costume design, cinematic lighting',
    title: 'Masked Assassin Character',
    tags: ['character', 'assassin', 'masked', 'action', 'game'],
    aspectRatio: '9:16',
    suggestedParams: { stylize: 650, chaos: 10 }
  },

  // Nature
  {
    id: 'nature-1',
    category: 'nature',
    prompt: 'Macro photography of morning dew on spider web, rainbow light refraction, perfect droplets, backlit by rising sun, nature photography, extreme detail, National Geographic quality',
    title: 'Spider Web Morning Dew',
    tags: ['nature', 'macro', 'dew', 'spider web', 'photography'],
    aspectRatio: '1:1',
    suggestedParams: { stylize: 350 }
  },
  {
    id: 'nature-2',
    category: 'nature',
    prompt: 'Bioluminescent ocean waves at night, glowing blue phytoplankton, starry sky reflection, magical beach scene, long exposure photography effect, ethereal natural phenomenon',
    title: 'Bioluminescent Ocean Waves',
    tags: ['nature', 'ocean', 'bioluminescent', 'night', 'magical'],
    aspectRatio: '16:9',
    suggestedParams: { stylize: 500 }
  },
  {
    id: 'nature-3',
    category: 'nature',
    prompt: 'Ancient giant sequoia forest, tiny person for scale, god rays through canopy, misty atmosphere, Pacific Northwest forest, awe-inspiring nature, environmental portrait',
    title: 'Giant Sequoia Forest',
    tags: ['nature', 'forest', 'sequoia', 'trees', 'majestic'],
    aspectRatio: '9:16',
    suggestedParams: { stylize: 400 }
  },
  {
    id: 'nature-4',
    category: 'nature',
    prompt: 'Close-up of exotic tropical bird, vibrant feather colors, shallow depth of field, professional wildlife photography, jungle background bokeh, perfect eye detail',
    title: 'Exotic Tropical Bird',
    tags: ['nature', 'bird', 'tropical', 'wildlife', 'colorful'],
    aspectRatio: '3:4',
    suggestedParams: { stylize: 450 }
  },
];

// Get prompts by category
export function getPromptsByCategory(category: PromptCategory): CuratedPrompt[] {
  return curatedPrompts.filter(p => p.category === category);
}

// Search curated prompts
export function searchCuratedPrompts(query: string): CuratedPrompt[] {
  if (!query.trim()) return curatedPrompts;

  const lowerQuery = query.toLowerCase();
  return curatedPrompts.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.prompt.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
}

// Get random curated prompts
export function getRandomCuratedPrompts(count: number = 6): CuratedPrompt[] {
  const shuffled = [...curatedPrompts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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
