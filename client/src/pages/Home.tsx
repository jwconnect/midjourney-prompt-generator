import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Copy, Check, Wand2, Image as ImageIcon, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [version, setVersion] = useState("6");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const artStyles = [
    "Photorealistic", "Oil Painting", "Watercolor", "Digital Art", "3D Render",
    "Anime", "Comic Book", "Sketch", "Abstract", "Minimalist",
    "Cyberpunk", "Steampunk", "Fantasy", "Sci-Fi", "Vintage"
  ];

  const moods = [
    "Dramatic", "Peaceful", "Energetic", "Mysterious", "Joyful",
    "Dark", "Bright", "Melancholic", "Epic", "Serene"
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
    { label: "V6 (Latest)", value: "6" },
    { label: "V5.2", value: "5.2" },
    { label: "V5.1", value: "5.1" },
    { label: "Niji 6", value: "niji 6" },
  ];

  const generatePrompt = () => {
    if (!idea.trim()) {
      toast.error("Please enter your idea first");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with a delay
    setTimeout(() => {
      let prompt = `/imagine prompt: ${idea}`;
      
      if (style) {
        prompt += `, ${style.toLowerCase()} style`;
      }
      
      if (mood) {
        prompt += `, ${mood.toLowerCase()} mood`;
      }

      // Add quality and detail modifiers
      prompt += ", highly detailed, professional quality, 8k resolution";

      // Add parameters
      if (aspectRatio !== "1:1") {
        prompt += ` --ar ${aspectRatio}`;
      }
      
      if (version) {
        prompt += ` --v ${version}`;
      }

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      toast.success("Prompt generated successfully!");
    }, 1000);
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const examplePrompts = [
    {
      title: "Fantasy Landscape",
      prompt: "/imagine prompt: A mystical forest with glowing mushrooms and floating islands, fantasy style, magical mood, highly detailed, professional quality, 8k resolution --ar 16:9 --v 6"
    },
    {
      title: "Cyberpunk Portrait",
      prompt: "/imagine prompt: A futuristic cyberpunk character with neon lights, digital art style, energetic mood, highly detailed, professional quality, 8k resolution --ar 2:3 --v 6"
    },
    {
      title: "Abstract Art",
      prompt: "/imagine prompt: Flowing geometric shapes with vibrant colors, abstract style, peaceful mood, highly detailed, professional quality, 8k resolution --ar 1:1 --v 6"
    }
  ];

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
                <h1 className="text-xl font-bold gradient-text">Midjourney Prompt Generator</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Prompt Optimization</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Info className="w-3 h-3" />
              Free Tool
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input Section */}
          <div className="space-y-6">
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-primary" />
                  Create Your Prompt
                </CardTitle>
                <CardDescription>
                  Describe your idea and customize parameters to generate optimized Midjourney prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Idea */}
                <div className="space-y-2">
                  <Label htmlFor="idea">Your Idea *</Label>
                  <Textarea
                    id="idea"
                    placeholder="e.g., A majestic lion in a savanna at sunset"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Art Style */}
                <div className="space-y-2">
                  <Label htmlFor="style">Art Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {artStyles.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mood */}
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Select a mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Parameters Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
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
                    <Label htmlFor="version">Version</Label>
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-sm">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Be specific about what you want to see</p>
                <p>• Combine multiple styles for unique results</p>
                <p>• Use descriptive adjectives (e.g., "majestic", "vibrant")</p>
                <p>• Experiment with different aspect ratios</p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Output Section */}
          <div className="space-y-6">
            {/* Generated Prompt */}
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Generated Prompt
                </CardTitle>
                <CardDescription>
                  Copy and paste this prompt into Midjourney
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedPrompt ? (
                  <>
                    <div className="relative">
                      <Textarea
                        value={generatedPrompt}
                        readOnly
                        rows={6}
                        className="font-mono text-sm bg-muted/50 pr-12"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={copyToClipboard}
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="w-full"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                    <p>Your generated prompt will appear here</p>
                    <p className="text-sm mt-2">Fill in the form and click "Generate Prompt"</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Example Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">📚 Example Prompts</CardTitle>
                <CardDescription className="text-xs">
                  Click to copy and try these examples
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {examplePrompts.map((example, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors group"
                    onClick={() => {
                      setGeneratedPrompt(example.prompt);
                      toast.success(`Loaded: ${example.title}`);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1">{example.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {example.prompt}
                        </p>
                      </div>
                      <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tools Comparison Section */}
        <div className="mt-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">🔍 Prompt Tools Comparison</CardTitle>
              <CardDescription>
                Comprehensive analysis of open-source Midjourney prompt management tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="generators" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="generators">Generators</TabsTrigger>
                  <TabsTrigger value="managers">Managers</TabsTrigger>
                  <TabsTrigger value="libraries">Libraries</TabsTrigger>
                </TabsList>

                <TabsContent value="generators" className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ToolCard
                      name="Amery2010/midjourney-prompt-generator"
                      stars={169}
                      tech="Next.js, TypeScript, Tailwind CSS"
                      pros={[
                        "Text-to-Prompt & Image-to-Prompt",
                        "Modern tech stack",
                        "Docker support",
                        "Real-time preview",
                        "One-click copy"
                      ]}
                      cons={[
                        "Requires AI API key",
                        "Limited version control",
                        "No team collaboration"
                      ]}
                    />
                    <ToolCard
                      name="Nafi7393/Midjourney-Prompt-Builder"
                      stars={2}
                      tech="Python, Streamlit, Gemini API"
                      pros={[
                        "AI-powered generation",
                        "Intuitive web interface",
                        "Multiple parameters",
                        "Easy to customize"
                      ]}
                      cons={[
                        "Requires Gemini API key",
                        "No prompt storage",
                        "Python dependency"
                      ]}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="managers" className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ToolCard
                      name="Langfuse"
                      stars={18700}
                      tech="TypeScript, Enterprise-grade"
                      pros={[
                        "Enterprise-grade management",
                        "Version control",
                        "Team collaboration",
                        "Playground testing",
                        "Self-hosted option"
                      ]}
                      cons={[
                        "Complex initial setup",
                        "Overkill for small projects",
                        "Not Midjourney-specific"
                      ]}
                    />
                    <ToolCard
                      name="scpedicini/midjourney-manager"
                      stars={3}
                      tech="JavaScript, CLI"
                      pros={[
                        "Bulk image download",
                        "Metadata embedding",
                        "Sidecar files",
                        "Download tracking"
                      ]}
                      cons={[
                        "Archived (no longer maintained)",
                        "Cloudflare issues",
                        "Limited to 2500 images"
                      ]}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="libraries" className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ToolCard
                      name="Prompt Library"
                      stars={0}
                      tech="Web-based"
                      pros={[
                        "25,000+ free prompts",
                        "Multiple AI tools support",
                        "Category organization",
                        "Search functionality"
                      ]}
                      cons={[
                        "No version control",
                        "No customization",
                        "Read-only access"
                      ]}
                    />
                    <ToolCard
                      name="Midlibrary"
                      stars={0}
                      tech="Web-based"
                      pros={[
                        "Advanced style library",
                        "SREF codes",
                        "Midjourney guides",
                        "Workflow optimization"
                      ]}
                      cons={[
                        "Midjourney-specific only",
                        "No API access",
                        "Limited free features"
                      ]}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
          <p className="mt-2">Open-source project for Midjourney prompt generation</p>
        </div>
      </footer>
    </div>
  );
}

interface ToolCardProps {
  name: string;
  stars: number;
  tech: string;
  pros: string[];
  cons: string[];
}

function ToolCard({ name, stars, tech, pros, cons }: ToolCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{name}</CardTitle>
            <CardDescription className="text-xs mt-1">{tech}</CardDescription>
          </div>
          {stars > 0 && (
            <Badge variant="secondary" className="flex-shrink-0">
              ⭐ {stars.toLocaleString()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-green-600 mb-1">✅ Pros:</p>
          <ul className="text-xs space-y-0.5 text-muted-foreground">
            {pros.map((pro, i) => (
              <li key={i}>• {pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-red-600 mb-1">❌ Cons:</p>
          <ul className="text-xs space-y-0.5 text-muted-foreground">
            {cons.map((con, i) => (
              <li key={i}>• {con}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
