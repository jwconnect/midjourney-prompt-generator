import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Sparkles, Copy, Check, Wand2, Image as ImageIcon, Info, Search,
  Heart, Folder, Plus, Trash2, Edit3, MoreVertical, Globe,
  History, Star, FolderOpen, Download, ChevronDown, ExternalLink,
  Eye, EyeOff, Settings2, Save, Zap, Shuffle, FileText, Scan
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SavedPrompt, PromptGroup, LexicaImage, FilterOptions, AdvancedParams, PromptTemplate, PromptAnalysis } from "@/types";
import * as storage from "@/lib/storage";
import { searchLexicaPrompts, formatLexicaPromptForMidjourney, parsePrompt, getRandomSuggestion, analyzePromptAdvanced, analysisToAdvancedParams, popularSrefCodes } from "@/lib/api";

// Highlight colors for different prompt parts
const highlightColors = {
  subject: 'bg-blue-100 text-blue-800 border-blue-300',
  style: 'bg-purple-100 text-purple-800 border-purple-300',
  mood: 'bg-green-100 text-green-800 border-green-300',
  parameter: 'bg-orange-100 text-orange-800 border-orange-300',
  normal: '',
};

// Group colors palette
const groupColors = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7',
  '#ec4899', '#f43f5e'
];

export default function Home() {
  const { t, language, setLanguage } = useLanguage();

  // Generator State
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [version, setVersion] = useState("6");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  // Advanced Parameters State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedParams>(storage.getDefaultAdvancedParams());

  // Explore State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LexicaImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  // History State
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [groups, setGroups] = useState<PromptGroup[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchQuery: '',
    groupId: null,
    favoritesOnly: false,
    sortBy: 'newest',
  });

  // Template State
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  // Analyzer State
  const [analyzerInput, setAnalyzerInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState<PromptAnalysis | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState("create");
  const [showHighlight, setShowHighlight] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(groupColors[0]);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);

  // Data arrays
  const artStyles = [
    { value: "Photorealistic", labelKey: "style.photorealistic" },
    { value: "Oil Painting", labelKey: "style.oilPainting" },
    { value: "Watercolor", labelKey: "style.watercolor" },
    { value: "Digital Art", labelKey: "style.digitalArt" },
    { value: "3D Render", labelKey: "style.3dRender" },
    { value: "Anime", labelKey: "style.anime" },
    { value: "Comic Book", labelKey: "style.comicBook" },
    { value: "Sketch", labelKey: "style.sketch" },
    { value: "Abstract", labelKey: "style.abstract" },
    { value: "Minimalist", labelKey: "style.minimalist" },
    { value: "Cyberpunk", labelKey: "style.cyberpunk" },
    { value: "Steampunk", labelKey: "style.steampunk" },
    { value: "Fantasy", labelKey: "style.fantasy" },
    { value: "Sci-Fi", labelKey: "style.sciFi" },
    { value: "Vintage", labelKey: "style.vintage" },
  ];

  const moods = [
    { value: "Dramatic", labelKey: "mood.dramatic" },
    { value: "Peaceful", labelKey: "mood.peaceful" },
    { value: "Energetic", labelKey: "mood.energetic" },
    { value: "Mysterious", labelKey: "mood.mysterious" },
    { value: "Joyful", labelKey: "mood.joyful" },
    { value: "Dark", labelKey: "mood.dark" },
    { value: "Bright", labelKey: "mood.bright" },
    { value: "Melancholic", labelKey: "mood.melancholic" },
    { value: "Epic", labelKey: "mood.epic" },
    { value: "Serene", labelKey: "mood.serene" },
  ];

  const aspectRatios = [
    { label: "Square (1:1)", value: "1:1" },
    { label: "Portrait (2:3)", value: "2:3" },
    { label: "Portrait (9:16)", value: "9:16" },
    { label: "Landscape (3:2)", value: "3:2" },
    { label: "Landscape (16:9)", value: "16:9" },
    { label: "Ultrawide (21:9)", value: "21:9" },
  ];

  const versions = [
    { label: "V7 (Latest)", value: "7" },
    { label: "V6.1", value: "6.1" },
    { label: "V6", value: "6" },
    { label: "V5.2", value: "5.2" },
    { label: "Niji 6", value: "niji 6" },
  ];

  const qualityOptions = [
    { label: "0.25 (Draft)", value: "0.25" },
    { label: "0.5 (Low)", value: "0.5" },
    { label: "1 (Standard)", value: "1" },
  ];

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    setSavedPrompts(storage.getAllPrompts());
    setGroups(storage.getAllGroups());
    setTemplates(storage.getAllTemplates());
  }, []);

  // Filter prompts based on current options
  const filteredPrompts = useMemo(() => {
    return storage.filterPrompts(filterOptions);
  }, [savedPrompts, filterOptions]);

  const favoritePrompts = useMemo(() => {
    return savedPrompts.filter(p => p.isFavorite);
  }, [savedPrompts]);

  // Generate prompt
  const generatePrompt = () => {
    if (!idea.trim()) {
      toast.error(t('toast.enterIdea'));
      return;
    }

    setIsGenerating(true);
    setSaved(false);

    setTimeout(() => {
      let prompt = `/imagine prompt: ${idea}`;

      if (style) {
        prompt += `, ${style.toLowerCase()} style`;
      }

      if (mood) {
        prompt += `, ${mood.toLowerCase()} mood`;
      }

      prompt += ", highly detailed, professional quality, 8k resolution";

      // Add basic parameters
      if (aspectRatio !== "1:1") {
        prompt += ` --ar ${aspectRatio}`;
      }

      if (version) {
        prompt += ` --v ${version}`;
      }

      // Add advanced parameters
      if (advanced.stylize !== null) {
        prompt += ` --s ${advanced.stylize}`;
      }
      if (advanced.chaos !== null) {
        prompt += ` --c ${advanced.chaos}`;
      }
      if (advanced.weird !== null) {
        prompt += ` --weird ${advanced.weird}`;
      }
      if (advanced.quality !== null) {
        prompt += ` --q ${advanced.quality}`;
      }
      if (advanced.seed !== null) {
        prompt += ` --seed ${advanced.seed}`;
      }
      if (advanced.stop !== null) {
        prompt += ` --stop ${advanced.stop}`;
      }
      if (advanced.tile) {
        prompt += ` --tile`;
      }
      if (advanced.sref) {
        prompt += ` --sref ${advanced.sref}`;
        if (advanced.srefWeight !== null) {
          prompt += ` --sw ${advanced.srefWeight}`;
        }
      }
      if (advanced.negativePrompt) {
        prompt += ` --no ${advanced.negativePrompt}`;
      }

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      toast.success(t('toast.promptGenerated'));
    }, 1000);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(t('toast.promptCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  // Save prompt
  const savePrompt = (prompt: string, title?: string, source: 'generated' | 'imported' | 'external' = 'generated', imageUrl?: string, externalSource?: string) => {
    const extractedTitle = title || prompt.substring(0, 50).replace('/imagine prompt: ', '') + '...';

    storage.savePrompt({
      prompt,
      title: extractedTitle,
      isFavorite: false,
      groupId: null,
      tags: [],
      source,
      imageUrl,
      externalSource,
    });

    loadData();
    setSaved(true);
    toast.success(t('toast.promptSaved'));
    setTimeout(() => setSaved(false), 2000);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    const newState = storage.toggleFavorite(id);
    loadData();
    if (newState) {
      toast.success(t('toast.favoriteAdded'));
    } else {
      toast.success(t('toast.favoriteRemoved'));
    }
  };

  // Delete prompt
  const handleDeletePrompt = (id: string) => {
    storage.deletePrompt(id);
    loadData();
    toast.success(t('toast.promptDeleted'));
  };

  // Move prompt to group
  const handleMoveToGroup = (promptId: string, groupId: string | null) => {
    storage.movePromptToGroup(promptId, groupId);
    loadData();
  };

  // Create group
  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    storage.createGroup(newGroupName.trim(), newGroupColor);
    loadData();
    setNewGroupName("");
    setNewGroupColor(groupColors[0]);
    setIsGroupDialogOpen(false);
    toast.success(t('toast.groupCreated'));
  };

  // Delete group
  const handleDeleteGroup = (id: string) => {
    storage.deleteGroup(id, true);
    loadData();
    toast.success(t('toast.groupDeleted'));
  };

  // Search external prompts
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLexicaPrompts(searchQuery);
      setSearchResults(results);
    } catch {
      toast.error(t('toast.searchError'));
    } finally {
      setIsSearching(false);
    }
  };

  // Import external prompt
  const handleImportPrompt = (image: LexicaImage) => {
    const formattedPrompt = formatLexicaPromptForMidjourney(image.prompt, aspectRatio, version);
    savePrompt(formattedPrompt, image.prompt.substring(0, 50), 'external', image.srcSmall, 'Lexica.art');
    setImportedIds(prev => new Set(prev).add(image.id));
    toast.success(t('toast.promptImported'));
  };

  // Template functions
  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;

    storage.saveTemplate({
      name: newTemplateName.trim(),
      style,
      mood,
      aspectRatio,
      version,
      advanced,
    });

    loadData();
    setNewTemplateName("");
    setIsTemplateDialogOpen(false);
    toast.success(t('toast.templateSaved'));
  };

  const handleApplyTemplate = (template: PromptTemplate) => {
    setStyle(template.style);
    setMood(template.mood);
    setAspectRatio(template.aspectRatio);
    setVersion(template.version);
    setAdvanced(template.advanced);
    toast.success(t('toast.templateApplied'));
  };

  const handleDeleteTemplate = (id: string) => {
    storage.deleteTemplate(id);
    loadData();
    toast.success(t('toast.templateDeleted'));
  };

  // Analyzer function
  const handleAnalyze = () => {
    if (!analyzerInput.trim()) return;
    const result = analyzePromptAdvanced(analyzerInput);
    setAnalysisResult(result);
  };

  const handleUseAnalysis = () => {
    if (!analysisResult) return;

    // Apply analysis to current settings
    if (analysisResult.parameters.ar) {
      setAspectRatio(analysisResult.parameters.ar);
    }
    if (analysisResult.parameters.v) {
      setVersion(analysisResult.parameters.v);
    }

    const advParams = analysisToAdvancedParams(analysisResult);
    setAdvanced(prev => ({ ...prev, ...advParams }));

    // Extract subject as idea
    if (analysisResult.subject) {
      setIdea(analysisResult.subject);
    }

    setShowAdvanced(true);
    setActiveTab("create");
    toast.success(t('toast.templateApplied'));
  };

  // Render highlighted prompt
  const renderHighlightedPrompt = (prompt: string) => {
    if (!showHighlight) {
      return <span>{prompt}</span>;
    }

    const parsed = parsePrompt(prompt);
    const parts: { text: string; type: keyof typeof highlightColors }[] = [];

    let workingPrompt = prompt.replace(/^\/imagine prompt:\s*/i, '');
    const paramMatches = workingPrompt.match(/--\w+\s+[^\s-]+/g) || [];
    paramMatches.forEach(param => {
      workingPrompt = workingPrompt.replace(param, '');
    });

    const segments = workingPrompt.split(',').map(s => s.trim()).filter(Boolean);

    parts.push({ text: '/imagine prompt: ', type: 'normal' });

    segments.forEach((segment, index) => {
      const segmentLower = segment.toLowerCase();
      let type: keyof typeof highlightColors = 'normal';

      if (parsed.styles.some(s => segmentLower.includes(s.toLowerCase()))) {
        type = 'style';
      } else if (parsed.moods.some(m => segmentLower.includes(m.toLowerCase()))) {
        type = 'mood';
      } else if (index === 0 && segment.length > 5) {
        type = 'subject';
      }

      parts.push({ text: segment, type });
      if (index < segments.length - 1) {
        parts.push({ text: ', ', type: 'normal' });
      }
    });

    if (paramMatches.length > 0) {
      parts.push({ text: ' ', type: 'normal' });
      paramMatches.forEach((param, index) => {
        parts.push({ text: param, type: 'parameter' });
        if (index < paramMatches.length - 1) {
          parts.push({ text: ' ', type: 'normal' });
        }
      });
    }

    return (
      <span className="whitespace-pre-wrap">
        {parts.map((part, index) => (
          <span
            key={index}
            className={`${highlightColors[part.type]} ${part.type !== 'normal' ? 'px-1 py-0.5 rounded border mx-0.5' : ''}`}
          >
            {part.text}
          </span>
        ))}
      </span>
    );
  };

  // Prompt Card Component
  const PromptCard = ({ prompt, showGroup = true }: { prompt: SavedPrompt; showGroup?: boolean }) => {
    const group = groups.find(g => g.id === prompt.groupId);

    return (
      <Card className="group hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{prompt.title}</h4>
                {prompt.source === 'external' && (
                  <Badge variant="outline" className="text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {prompt.externalSource}
                  </Badge>
                )}
              </div>
              {showGroup && group && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: group.color + '20', borderColor: group.color }}
                >
                  <Folder className="w-3 h-3 mr-1" style={{ color: group.color }} />
                  {group.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleToggleFavorite(prompt.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${prompt.isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {prompt.isFavorite ? t('toast.favoriteRemoved') : t('toast.favoriteAdded')}
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => copyToClipboard(prompt.prompt)}>
                    <Copy className="w-4 h-4 mr-2" />
                    {t('output.copy')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setGeneratedPrompt(prompt.prompt);
                    setActiveTab("create");
                  }}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    {t('history.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center w-full px-2 py-1.5 text-sm">
                      <Folder className="w-4 h-4 mr-2" />
                      {t('groups.moveToGroup')}
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                      <DropdownMenuItem onClick={() => handleMoveToGroup(prompt.id, null)}>
                        <FolderOpen className="w-4 h-4 mr-2" />
                        {t('groups.ungrouped')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {groups.map(g => (
                        <DropdownMenuItem key={g.id} onClick={() => handleMoveToGroup(prompt.id, g.id)}>
                          <Folder className="w-4 h-4 mr-2" style={{ color: g.color }} />
                          {g.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeletePrompt(prompt.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('history.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {prompt.imageUrl && (
            <div className="mb-2 rounded-md overflow-hidden">
              <img
                src={prompt.imageUrl}
                alt={prompt.title}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          <p className="text-xs text-muted-foreground line-clamp-3 font-mono">
            {prompt.prompt}
          </p>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => copyToClipboard(prompt.prompt)}
            >
              <Copy className="w-3 h-3 mr-1" />
              {t('output.copy')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">{t('app.title')}</h1>
                <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Globe className="w-4 h-4" />
                    {language === 'ko' ? '한국어' : 'English'}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage('ko')}>
                    {language === 'ko' && <Check className="w-4 h-4 mr-2" />}
                    한국어
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')}>
                    {language === 'en' && <Check className="w-4 h-4 mr-2" />}
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Badge variant="secondary" className="gap-1">
                <Info className="w-3 h-3" />
                {t('app.freeTool')}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="create" className="gap-1">
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.create')}</span>
            </TabsTrigger>
            <TabsTrigger value="explore" className="gap-1">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.explore')}</span>
            </TabsTrigger>
            <TabsTrigger value="analyzer" className="gap-1">
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">{t('analyzer.title')}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.history')}</span>
              {savedPrompts.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {savedPrompts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.favorites')}</span>
              {favoritePrompts.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {favoritePrompts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Input Section */}
              <div className="space-y-6">
                <Card className="shadow-lg border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-primary" />
                      {t('create.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('create.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Main Idea */}
                    <div className="space-y-2">
                      <Label htmlFor="idea">{t('create.idea')}</Label>
                      <Textarea
                        id="idea"
                        placeholder={t('create.ideaPlaceholder')}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    {/* Art Style */}
                    <div className="space-y-2">
                      <Label htmlFor="style">{t('create.style')}</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger id="style">
                          <SelectValue placeholder={t('create.stylePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {artStyles.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {t(s.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Mood */}
                    <div className="space-y-2">
                      <Label htmlFor="mood">{t('create.mood')}</Label>
                      <Select value={mood} onValueChange={setMood}>
                        <SelectTrigger id="mood">
                          <SelectValue placeholder={t('create.moodPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {moods.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {t(m.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Parameters Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aspect-ratio">{t('create.aspectRatio')}</Label>
                        <Select value={aspectRatio} onValueChange={setAspectRatio}>
                          <SelectTrigger id="aspect-ratio">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {aspectRatios.map((ar) => (
                              <SelectItem key={ar.value} value={ar.value}>
                                {ar.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="version">{t('create.version')}</Label>
                        <Select value={version} onValueChange={setVersion}>
                          <SelectTrigger id="version">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {versions.map((v) => (
                              <SelectItem key={v.value} value={v.value}>
                                {v.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Advanced Parameters Collapsible */}
                    <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <Settings2 className="w-4 h-4" />
                            {t('advanced.toggle')}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-4 pt-4">
                        {/* Stylize */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>{t('advanced.stylize')}</Label>
                            <span className="text-xs text-muted-foreground">{advanced.stylize ?? 100}</span>
                          </div>
                          <Slider
                            value={[advanced.stylize ?? 100]}
                            onValueChange={([v]) => setAdvanced(prev => ({ ...prev, stylize: v }))}
                            min={0}
                            max={1000}
                            step={10}
                          />
                          <p className="text-xs text-muted-foreground">{t('advanced.stylizeDesc')}</p>
                        </div>

                        {/* Chaos */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>{t('advanced.chaos')}</Label>
                            <span className="text-xs text-muted-foreground">{advanced.chaos ?? 0}</span>
                          </div>
                          <Slider
                            value={[advanced.chaos ?? 0]}
                            onValueChange={([v]) => setAdvanced(prev => ({ ...prev, chaos: v }))}
                            min={0}
                            max={100}
                            step={5}
                          />
                          <p className="text-xs text-muted-foreground">{t('advanced.chaosDesc')}</p>
                        </div>

                        {/* Weird */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>{t('advanced.weird')}</Label>
                            <span className="text-xs text-muted-foreground">{advanced.weird ?? 0}</span>
                          </div>
                          <Slider
                            value={[advanced.weird ?? 0]}
                            onValueChange={([v]) => setAdvanced(prev => ({ ...prev, weird: v }))}
                            min={0}
                            max={3000}
                            step={100}
                          />
                          <p className="text-xs text-muted-foreground">{t('advanced.weirdDesc')}</p>
                        </div>

                        {/* Quality */}
                        <div className="space-y-2">
                          <Label>{t('advanced.quality')}</Label>
                          <Select
                            value={advanced.quality?.toString() || "1"}
                            onValueChange={(v) => setAdvanced(prev => ({ ...prev, quality: parseFloat(v) }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {qualityOptions.map((q) => (
                                <SelectItem key={q.value} value={q.value}>
                                  {q.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Seed */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>{t('advanced.seed')}</Label>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setAdvanced(prev => ({ ...prev, seed: Math.floor(Math.random() * 4294967295) }))}
                            >
                              <Shuffle className="w-3 h-3 mr-1" />
                              Random
                            </Button>
                          </div>
                          <Input
                            type="number"
                            placeholder="Enter seed number"
                            value={advanced.seed ?? ''}
                            onChange={(e) => setAdvanced(prev => ({ ...prev, seed: e.target.value ? parseInt(e.target.value) : null }))}
                          />
                        </div>

                        {/* Tile */}
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>{t('advanced.tile')}</Label>
                            <p className="text-xs text-muted-foreground">{t('advanced.tileDesc')}</p>
                          </div>
                          <Switch
                            checked={advanced.tile}
                            onCheckedChange={(v) => setAdvanced(prev => ({ ...prev, tile: v }))}
                          />
                        </div>

                        {/* SREF */}
                        <div className="space-y-2">
                          <Label>{t('sref.title')}</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder={t('sref.codePlaceholder')}
                              value={advanced.sref}
                              onChange={(e) => setAdvanced(prev => ({ ...prev, sref: e.target.value }))}
                              className="flex-1"
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Zap className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {popularSrefCodes.map((sref) => (
                                  <DropdownMenuItem
                                    key={sref.code}
                                    onClick={() => setAdvanced(prev => ({ ...prev, sref: sref.code }))}
                                  >
                                    <span className="font-mono">{sref.code}</span>
                                    <span className="ml-2 text-muted-foreground">- {sref.description}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {advanced.sref && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">{t('sref.weight')}</Label>
                                <span className="text-xs text-muted-foreground">{advanced.srefWeight ?? 100}</span>
                              </div>
                              <Slider
                                value={[advanced.srefWeight ?? 100]}
                                onValueChange={([v]) => setAdvanced(prev => ({ ...prev, srefWeight: v }))}
                                min={0}
                                max={1000}
                                step={10}
                              />
                            </div>
                          )}
                        </div>

                        {/* Negative Prompt */}
                        <div className="space-y-2">
                          <Label>{t('negative.title')}</Label>
                          <Input
                            placeholder={t('negative.placeholder')}
                            value={advanced.negativePrompt}
                            onChange={(e) => setAdvanced(prev => ({ ...prev, negativePrompt: e.target.value }))}
                          />
                          <p className="text-xs text-muted-foreground">{t('negative.hint')}</p>
                        </div>

                        {/* Reset Advanced */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAdvanced(storage.getDefaultAdvancedParams())}
                          className="w-full"
                        >
                          Reset Advanced Parameters
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Generate Button */}
                    <Button
                      onClick={generatePrompt}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          {t('create.generating')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {t('create.generate')}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Templates */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {t('template.title')}
                      </CardTitle>
                      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Save className="w-3 h-3 mr-1" />
                            {t('template.save')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t('template.save')}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>{t('template.name')}</Label>
                              <Input
                                placeholder={t('template.namePlaceholder')}
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                              {t('groups.cancel')}
                            </Button>
                            <Button onClick={handleSaveTemplate}>
                              {t('groups.save')}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {templates.length > 0 ? (
                      <div className="space-y-2">
                        {templates.map(template => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted"
                          >
                            <span className="text-sm font-medium">{template.name}</span>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleApplyTemplate(template)}>
                                {t('template.apply')}
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(template.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        {t('template.emptyHint')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Output Section */}
              <div className="space-y-6">
                {/* Generated Prompt */}
                <Card className="shadow-lg border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-primary" />
                          {t('output.title')}
                        </CardTitle>
                        <CardDescription>
                          {t('output.description')}
                        </CardDescription>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setShowHighlight(!showHighlight)}
                          >
                            {showHighlight ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('highlight.toggle')}</TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {generatedPrompt ? (
                      <>
                        <div className="relative">
                          <div className="min-h-[150px] p-3 rounded-md bg-muted/50 border font-mono text-sm overflow-auto">
                            {renderHighlightedPrompt(generatedPrompt)}
                          </div>
                        </div>

                        {showHighlight && (
                          <div className="flex flex-wrap gap-2">
                            <Badge className={highlightColors.subject + ' border'}>{t('highlight.subject')}</Badge>
                            <Badge className={highlightColors.style + ' border'}>{t('highlight.style')}</Badge>
                            <Badge className={highlightColors.mood + ' border'}>{t('highlight.mood')}</Badge>
                            <Badge className={highlightColors.parameter + ' border'}>{t('highlight.parameter')}</Badge>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyToClipboard(generatedPrompt)}
                            variant="outline"
                            className="flex-1"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                {t('output.copied')}
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                {t('output.copy')}
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => savePrompt(generatedPrompt)}
                            variant="outline"
                            className="flex-1"
                          >
                            {saved ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                {t('output.saved')}
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-2" />
                                {t('output.save')}
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                        <p>{t('output.empty')}</p>
                        <p className="text-sm mt-2">{t('output.emptyHint')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-sm">{t('tips.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>{t('tips.tip1')}</p>
                    <p>{t('tips.tip2')}</p>
                    <p>{t('tips.tip3')}</p>
                    <p>{t('tips.tip4')}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Explore Tab */}
          <TabsContent value="explore" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  {t('explore.title')}
                </CardTitle>
                <CardDescription>
                  {t('explore.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={t('explore.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {isSearching ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        {t('explore.searching')}
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {t('explore.search')}
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  {t('explore.poweredBy')}
                </p>

                {searchResults.length > 0 ? (
                  <ScrollArea className="h-[600px]">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-4">
                      {searchResults.map((image) => (
                        <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-square overflow-hidden bg-muted">
                            <img
                              src={image.srcSmall}
                              alt={image.prompt.substring(0, 50)}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>
                          <CardContent className="p-3">
                            <p className="text-xs text-muted-foreground line-clamp-3 mb-3 font-mono">
                              {image.prompt}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => copyToClipboard(formatLexicaPromptForMidjourney(image.prompt, aspectRatio, version))}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                {t('output.copy')}
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleImportPrompt(image)}
                                disabled={importedIds.has(image.id)}
                              >
                                {importedIds.has(image.id) ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1" />
                                    {t('explore.imported')}
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-3 h-3 mr-1" />
                                    {t('explore.import')}
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p>{t('explore.noResults')}</p>
                    <p className="text-sm mt-2">{t('explore.searchHint')}</p>
                    <p className="text-xs mt-4">
                      Try: <span
                        className="text-primary cursor-pointer hover:underline"
                        onClick={() => setSearchQuery(getRandomSuggestion())}
                      >
                        {getRandomSuggestion()}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyzer Tab */}
          <TabsContent value="analyzer" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="w-5 h-5 text-primary" />
                    {t('analyzer.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('analyzer.input')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={t('analyzer.inputPlaceholder')}
                    value={analyzerInput}
                    onChange={(e) => setAnalyzerInput(e.target.value)}
                    rows={6}
                  />
                  <Button onClick={handleAnalyze} className="w-full">
                    <Scan className="w-4 h-4 mr-2" />
                    {t('analyzer.analyze')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {t('analyzer.result')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisResult ? (
                    <div className="space-y-4">
                      {analysisResult.subject && (
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('analyzer.subject')}</Label>
                          <p className="text-sm font-medium">{analysisResult.subject}</p>
                        </div>
                      )}
                      {analysisResult.styles.length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('analyzer.styles')}</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysisResult.styles.map((s, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.moods.length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('analyzer.moods')}</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysisResult.moods.map((m, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {Object.keys(analysisResult.parameters).length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('analyzer.params')}</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(analysisResult.parameters).map(([k, v]) => (
                              <Badge key={k} variant="outline" className="text-xs font-mono">
                                --{k} {v}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.modifiers.length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('analyzer.modifiers')}</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysisResult.modifiers.map((m, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResult.negatives.length > 0 && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Negative ({t('negative.title')})</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysisResult.negatives.map((n, i) => (
                              <Badge key={i} variant="destructive" className="text-xs">{n}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button onClick={handleUseAnalysis} className="w-full mt-4">
                        <Wand2 className="w-4 h-4 mr-2" />
                        {t('analyzer.useThis')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                      <Scan className="w-12 h-12 mb-4 opacity-20" />
                      <p>Paste a prompt and click Analyze</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5 text-primary" />
                      {t('history.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('history.description')}
                    </CardDescription>
                  </div>

                  <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('groups.create')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('groups.createTitle')}</DialogTitle>
                        <DialogDescription>
                          {t('groups.description')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>{t('groups.name')}</Label>
                          <Input
                            placeholder={t('groups.namePlaceholder')}
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('groups.color')}</Label>
                          <div className="flex flex-wrap gap-2">
                            {groupColors.map((color) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                                  newGroupColor === color ? 'scale-110 border-primary' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => setNewGroupColor(color)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGroupDialogOpen(false)}>
                          {t('groups.cancel')}
                        </Button>
                        <Button onClick={handleCreateGroup}>
                          {t('groups.save')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder={t('history.search')}
                    value={filterOptions.searchQuery}
                    onChange={(e) => setFilterOptions(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="flex-1"
                  />
                  <Select
                    value={filterOptions.groupId || 'all'}
                    onValueChange={(v) => setFilterOptions(prev => ({ ...prev, groupId: v === 'all' ? null : v }))}
                  >
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder={t('history.filter')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('history.all')}</SelectItem>
                      {groups.map(g => (
                        <SelectItem key={g.id} value={g.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                            {g.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterOptions.sortBy}
                    onValueChange={(v) => setFilterOptions(prev => ({ ...prev, sortBy: v as FilterOptions['sortBy'] }))}
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder={t('history.sort')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t('history.sortNewest')}</SelectItem>
                      <SelectItem value="oldest">{t('history.sortOldest')}</SelectItem>
                      <SelectItem value="alphabetical">{t('history.sortAlphabetical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Groups List */}
                {groups.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {groups.map(group => (
                      <Badge
                        key={group.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-muted transition-colors group/badge"
                        style={{ borderColor: group.color }}
                        onClick={() => setFilterOptions(prev => ({
                          ...prev,
                          groupId: prev.groupId === group.id ? null : group.id
                        }))}
                      >
                        <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: group.color }} />
                        {group.name}
                        <span className="ml-1 text-muted-foreground">
                          ({savedPrompts.filter(p => p.groupId === group.id).length})
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 ml-1 opacity-0 group-hover/badge:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Prompts Grid */}
                {filteredPrompts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrompts.map(prompt => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <History className="w-12 h-12 mb-4 opacity-20" />
                    <p>{t('history.empty')}</p>
                    <p className="text-sm mt-2">{t('history.emptyHint')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  {t('favorites.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritePrompts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoritePrompts.map(prompt => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                    <Heart className="w-12 h-12 mb-4 opacity-20" />
                    <p>{t('favorites.empty')}</p>
                    <p className="text-sm mt-2">{t('favorites.emptyHint')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>{t('footer.builtWith')}</p>
          <p className="mt-2">{t('footer.openSource')}</p>
        </div>
      </footer>
    </div>
  );
}
