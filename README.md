# Midjourney Prompt Generator

AI-powered Midjourney prompt generator with comprehensive open-source tool comparison and analysis.

## Features

- **Prompt Generation**: Create optimized Midjourney prompts with customizable parameters
- **Art Style Selection**: Choose from 15+ art styles (Photorealistic, Oil Painting, Cyberpunk, etc.)
- **Mood Customization**: Set the mood (Dramatic, Peaceful, Energetic, etc.)
- **Parameter Control**: Aspect ratio, version selection, and more
- **Example Prompts**: Pre-built examples to get started quickly
- **Tool Comparison**: Comprehensive analysis of 9+ open-source prompt management tools

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **UI Components**: shadcn/ui, Radix UI
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom purple gradient theme

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/jwconnect/midjourney-prompt-generator.git
cd midjourney-prompt-generator

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## Usage

1. Enter your idea in the "Your Idea" field
2. Select art style and mood (optional)
3. Choose aspect ratio and Midjourney version
4. Click "Generate Prompt"
5. Copy the generated prompt and use it in Midjourney

## Tool Comparison

The app includes a comprehensive comparison of open-source Midjourney prompt tools:

- **Prompt Generators**: Amery2010/midjourney-prompt-generator, Nafi7393/Midjourney-Prompt-Builder
- **Prompt Managers**: Langfuse, Pezzo
- **Prompt Libraries**: Prompt Library, Midlibrary
- **Image Managers**: scpedicini/midjourney-manager (archived)
- **ChatGPT Tools**: ChatGPT-Midjourney-Prompt-Generator, AnthusAI/openai-midjourney-prompt-generator

Each tool is analyzed with detailed pros, cons, use cases, and recommendations.

## Documentation

See [comprehensive_prompt_tools_analysis.md](./comprehensive_prompt_tools_analysis.md) for detailed analysis of all prompt management tools.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Inspired by various open-source Midjourney prompt tools
- Built with modern web technologies and best practices
