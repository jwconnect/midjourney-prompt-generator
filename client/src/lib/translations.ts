import type { Language, Translations } from '@/types';

const translations: Record<Language, Translations> = {
  ko: {
    // Header
    'app.title': '미드저니 프롬프트 생성기',
    'app.subtitle': 'AI 기반 프롬프트 최적화',
    'app.freeTool': '무료 도구',

    // Navigation
    'nav.create': '프롬프트 생성',
    'nav.explore': '프롬프트 탐색',
    'nav.history': '히스토리',
    'nav.favorites': '즐겨찾기',
    'nav.groups': '그룹',

    // Create Section
    'create.title': '프롬프트 만들기',
    'create.description': '아이디어를 입력하고 파라미터를 커스터마이즈하여 최적화된 미드저니 프롬프트를 생성하세요',
    'create.idea': '아이디어 *',
    'create.ideaPlaceholder': '예: 석양빛 사바나에 있는 장엄한 사자',
    'create.style': '아트 스타일',
    'create.stylePlaceholder': '스타일 선택',
    'create.mood': '분위기',
    'create.moodPlaceholder': '분위기 선택',
    'create.aspectRatio': '화면 비율',
    'create.version': '버전',
    'create.generate': '프롬프트 생성',
    'create.generating': '생성 중...',

    // Output Section
    'output.title': '생성된 프롬프트',
    'output.description': '이 프롬프트를 복사하여 미드저니에 붙여넣기하세요',
    'output.empty': '생성된 프롬프트가 여기에 표시됩니다',
    'output.emptyHint': '양식을 채우고 "프롬프트 생성"을 클릭하세요',
    'output.copy': '클립보드에 복사',
    'output.copied': '복사됨!',
    'output.save': '저장',
    'output.saved': '저장됨!',

    // Explore Section
    'explore.title': '프롬프트 탐색',
    'explore.description': 'Lexica에서 AI 아트 프롬프트를 검색하고 가져오세요',
    'explore.searchPlaceholder': '프롬프트 검색... (예: cyberpunk city, fantasy landscape)',
    'explore.search': '검색',
    'explore.searching': '검색 중...',
    'explore.import': '가져오기',
    'explore.imported': '가져옴!',
    'explore.noResults': '검색 결과가 없습니다',
    'explore.searchHint': '키워드를 입력하고 검색 버튼을 클릭하세요',
    'explore.poweredBy': 'Lexica.art 제공',

    // History Section
    'history.title': '프롬프트 히스토리',
    'history.description': '저장된 모든 프롬프트를 관리하세요',
    'history.empty': '저장된 프롬프트가 없습니다',
    'history.emptyHint': '프롬프트를 생성하고 저장하면 여기에 표시됩니다',
    'history.search': '프롬프트 검색...',
    'history.filter': '필터',
    'history.sort': '정렬',
    'history.sortNewest': '최신순',
    'history.sortOldest': '오래된순',
    'history.sortAlphabetical': '알파벳순',
    'history.all': '전체',
    'history.delete': '삭제',
    'history.edit': '수정',
    'history.deleteConfirm': '이 프롬프트를 삭제하시겠습니까?',

    // Groups Section
    'groups.title': '프롬프트 그룹',
    'groups.description': '프롬프트를 그룹으로 정리하세요',
    'groups.create': '새 그룹 만들기',
    'groups.createTitle': '새 그룹',
    'groups.name': '그룹 이름',
    'groups.namePlaceholder': '예: 판타지 아트',
    'groups.color': '색상',
    'groups.save': '저장',
    'groups.cancel': '취소',
    'groups.noGroups': '그룹이 없습니다',
    'groups.noGroupsHint': '프롬프트를 정리하기 위한 그룹을 만들어보세요',
    'groups.ungrouped': '미분류',
    'groups.moveToGroup': '그룹으로 이동',

    // Favorites
    'favorites.title': '즐겨찾기',
    'favorites.empty': '즐겨찾기한 프롬프트가 없습니다',
    'favorites.emptyHint': '프롬프트에서 하트를 클릭하여 즐겨찾기에 추가하세요',

    // Highlight
    'highlight.subject': '주제',
    'highlight.style': '스타일',
    'highlight.mood': '분위기',
    'highlight.parameter': '파라미터',
    'highlight.toggle': '강조 표시',

    // Tips
    'tips.title': '빠른 팁',
    'tips.tip1': '• 보고 싶은 것을 구체적으로 설명하세요',
    'tips.tip2': '• 독특한 결과를 위해 여러 스타일을 조합하세요',
    'tips.tip3': '• 설명적인 형용사를 사용하세요 (예: "장엄한", "생동감 있는")',
    'tips.tip4': '• 다양한 화면 비율을 실험해보세요',

    // Examples
    'examples.title': '예제 프롬프트',
    'examples.description': '클릭하여 복사하고 사용해보세요',
    'examples.fantasy': '판타지 풍경',
    'examples.cyberpunk': '사이버펑크 초상화',
    'examples.abstract': '추상 아트',

    // Art Styles
    'style.photorealistic': '사진처럼 사실적인',
    'style.oilPainting': '유화',
    'style.watercolor': '수채화',
    'style.digitalArt': '디지털 아트',
    'style.3dRender': '3D 렌더링',
    'style.anime': '애니메이션',
    'style.comicBook': '만화책',
    'style.sketch': '스케치',
    'style.abstract': '추상',
    'style.minimalist': '미니멀리스트',
    'style.cyberpunk': '사이버펑크',
    'style.steampunk': '스팀펑크',
    'style.fantasy': '판타지',
    'style.sciFi': 'SF',
    'style.vintage': '빈티지',

    // Moods
    'mood.dramatic': '극적인',
    'mood.peaceful': '평화로운',
    'mood.energetic': '활기찬',
    'mood.mysterious': '신비로운',
    'mood.joyful': '즐거운',
    'mood.dark': '어두운',
    'mood.bright': '밝은',
    'mood.melancholic': '우울한',
    'mood.epic': '웅장한',
    'mood.serene': '고요한',

    // Common
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다',
    'common.success': '성공!',
    'common.confirm': '확인',
    'common.cancel': '취소',
    'common.close': '닫기',
    'common.language': '언어',

    // Footer
    'footer.builtWith': 'React, TypeScript, Tailwind CSS로 제작',
    'footer.openSource': '미드저니 프롬프트 생성을 위한 오픈소스 프로젝트',

    // Toast Messages
    'toast.promptGenerated': '프롬프트가 생성되었습니다!',
    'toast.promptCopied': '클립보드에 복사되었습니다!',
    'toast.promptSaved': '프롬프트가 저장되었습니다!',
    'toast.promptDeleted': '프롬프트가 삭제되었습니다!',
    'toast.promptImported': '프롬프트를 가져왔습니다!',
    'toast.favoriteAdded': '즐겨찾기에 추가되었습니다!',
    'toast.favoriteRemoved': '즐겨찾기에서 제거되었습니다!',
    'toast.groupCreated': '그룹이 생성되었습니다!',
    'toast.groupDeleted': '그룹이 삭제되었습니다!',
    'toast.enterIdea': '먼저 아이디어를 입력하세요',
    'toast.searchError': '검색 중 오류가 발생했습니다',
    'toast.templateSaved': '템플릿이 저장되었습니다!',
    'toast.templateDeleted': '템플릿이 삭제되었습니다!',
    'toast.templateApplied': '템플릿이 적용되었습니다!',

    // Advanced Parameters
    'advanced.title': '고급 파라미터',
    'advanced.toggle': '고급 옵션',
    'advanced.stylize': '스타일화 (--s)',
    'advanced.stylizeDesc': '0-1000. 높을수록 예술적, 낮을수록 프롬프트에 충실',
    'advanced.chaos': '카오스 (--c)',
    'advanced.chaosDesc': '0-100. 높을수록 다양한 결과',
    'advanced.weird': '위어드 (--weird)',
    'advanced.weirdDesc': '0-3000. 독특하고 기이한 결과',
    'advanced.quality': '퀄리티 (--q)',
    'advanced.qualityDesc': '렌더링 품질 (0.25, 0.5, 1)',
    'advanced.seed': '시드 (--seed)',
    'advanced.seedDesc': '동일한 시드로 유사한 결과 재현',
    'advanced.tile': '타일 (--tile)',
    'advanced.tileDesc': '반복 가능한 패턴 생성',
    'advanced.stop': '스톱 (--stop)',
    'advanced.stopDesc': '10-100. 일찍 멈춰 미완성 느낌',

    // Negative Prompt
    'negative.title': '네거티브 프롬프트',
    'negative.placeholder': '제외할 요소 (예: text, watermark, blur)',
    'negative.hint': '콤마로 구분하여 여러 요소 제외',

    // SREF (Style Reference)
    'sref.title': '스타일 레퍼런스 (SREF)',
    'sref.code': 'SREF 코드',
    'sref.codePlaceholder': '예: 12345678 또는 random',
    'sref.weight': '스타일 가중치 (--sw)',
    'sref.weightDesc': '0-1000. 스타일 영향도',
    'sref.hint': '숫자 코드 또는 "random" 입력',

    // Templates
    'template.title': '프롬프트 템플릿',
    'template.save': '현재 설정을 템플릿으로 저장',
    'template.name': '템플릿 이름',
    'template.namePlaceholder': '예: 내 판타지 스타일',
    'template.empty': '저장된 템플릿이 없습니다',
    'template.emptyHint': '현재 설정을 템플릿으로 저장하세요',
    'template.apply': '적용',
    'template.delete': '삭제',

    // Prompt Analyzer
    'analyzer.title': '프롬프트 분석기',
    'analyzer.input': '분석할 프롬프트 입력',
    'analyzer.inputPlaceholder': '미드저니 프롬프트를 붙여넣기...',
    'analyzer.analyze': '분석',
    'analyzer.result': '분석 결과',
    'analyzer.subject': '주제',
    'analyzer.styles': '스타일',
    'analyzer.moods': '분위기',
    'analyzer.params': '파라미터',
    'analyzer.modifiers': '수식어',
    'analyzer.useThis': '이 설정 사용',
  },
  en: {
    // Header
    'app.title': 'Midjourney Prompt Generator',
    'app.subtitle': 'AI-Powered Prompt Optimization',
    'app.freeTool': 'Free Tool',

    // Navigation
    'nav.create': 'Create Prompt',
    'nav.explore': 'Explore Prompts',
    'nav.history': 'History',
    'nav.favorites': 'Favorites',
    'nav.groups': 'Groups',

    // Create Section
    'create.title': 'Create Your Prompt',
    'create.description': 'Describe your idea and customize parameters to generate optimized Midjourney prompts',
    'create.idea': 'Your Idea *',
    'create.ideaPlaceholder': 'e.g., A majestic lion in a savanna at sunset',
    'create.style': 'Art Style',
    'create.stylePlaceholder': 'Select a style',
    'create.mood': 'Mood',
    'create.moodPlaceholder': 'Select a mood',
    'create.aspectRatio': 'Aspect Ratio',
    'create.version': 'Version',
    'create.generate': 'Generate Prompt',
    'create.generating': 'Generating...',

    // Output Section
    'output.title': 'Generated Prompt',
    'output.description': 'Copy and paste this prompt into Midjourney',
    'output.empty': 'Your generated prompt will appear here',
    'output.emptyHint': 'Fill in the form and click "Generate Prompt"',
    'output.copy': 'Copy to Clipboard',
    'output.copied': 'Copied!',
    'output.save': 'Save',
    'output.saved': 'Saved!',

    // Explore Section
    'explore.title': 'Explore Prompts',
    'explore.description': 'Search and import AI art prompts from Lexica',
    'explore.searchPlaceholder': 'Search prompts... (e.g., cyberpunk city, fantasy landscape)',
    'explore.search': 'Search',
    'explore.searching': 'Searching...',
    'explore.import': 'Import',
    'explore.imported': 'Imported!',
    'explore.noResults': 'No results found',
    'explore.searchHint': 'Enter keywords and click search',
    'explore.poweredBy': 'Powered by Lexica.art',

    // History Section
    'history.title': 'Prompt History',
    'history.description': 'Manage all your saved prompts',
    'history.empty': 'No saved prompts',
    'history.emptyHint': 'Generate and save prompts to see them here',
    'history.search': 'Search prompts...',
    'history.filter': 'Filter',
    'history.sort': 'Sort',
    'history.sortNewest': 'Newest',
    'history.sortOldest': 'Oldest',
    'history.sortAlphabetical': 'Alphabetical',
    'history.all': 'All',
    'history.delete': 'Delete',
    'history.edit': 'Edit',
    'history.deleteConfirm': 'Are you sure you want to delete this prompt?',

    // Groups Section
    'groups.title': 'Prompt Groups',
    'groups.description': 'Organize your prompts into groups',
    'groups.create': 'Create New Group',
    'groups.createTitle': 'New Group',
    'groups.name': 'Group Name',
    'groups.namePlaceholder': 'e.g., Fantasy Art',
    'groups.color': 'Color',
    'groups.save': 'Save',
    'groups.cancel': 'Cancel',
    'groups.noGroups': 'No groups',
    'groups.noGroupsHint': 'Create groups to organize your prompts',
    'groups.ungrouped': 'Ungrouped',
    'groups.moveToGroup': 'Move to Group',

    // Favorites
    'favorites.title': 'Favorites',
    'favorites.empty': 'No favorite prompts',
    'favorites.emptyHint': 'Click the heart icon on prompts to add to favorites',

    // Highlight
    'highlight.subject': 'Subject',
    'highlight.style': 'Style',
    'highlight.mood': 'Mood',
    'highlight.parameter': 'Parameter',
    'highlight.toggle': 'Toggle Highlight',

    // Tips
    'tips.title': 'Quick Tips',
    'tips.tip1': '• Be specific about what you want to see',
    'tips.tip2': '• Combine multiple styles for unique results',
    'tips.tip3': '• Use descriptive adjectives (e.g., "majestic", "vibrant")',
    'tips.tip4': '• Experiment with different aspect ratios',

    // Examples
    'examples.title': 'Example Prompts',
    'examples.description': 'Click to copy and try these examples',
    'examples.fantasy': 'Fantasy Landscape',
    'examples.cyberpunk': 'Cyberpunk Portrait',
    'examples.abstract': 'Abstract Art',

    // Art Styles
    'style.photorealistic': 'Photorealistic',
    'style.oilPainting': 'Oil Painting',
    'style.watercolor': 'Watercolor',
    'style.digitalArt': 'Digital Art',
    'style.3dRender': '3D Render',
    'style.anime': 'Anime',
    'style.comicBook': 'Comic Book',
    'style.sketch': 'Sketch',
    'style.abstract': 'Abstract',
    'style.minimalist': 'Minimalist',
    'style.cyberpunk': 'Cyberpunk',
    'style.steampunk': 'Steampunk',
    'style.fantasy': 'Fantasy',
    'style.sciFi': 'Sci-Fi',
    'style.vintage': 'Vintage',

    // Moods
    'mood.dramatic': 'Dramatic',
    'mood.peaceful': 'Peaceful',
    'mood.energetic': 'Energetic',
    'mood.mysterious': 'Mysterious',
    'mood.joyful': 'Joyful',
    'mood.dark': 'Dark',
    'mood.bright': 'Bright',
    'mood.melancholic': 'Melancholic',
    'mood.epic': 'Epic',
    'mood.serene': 'Serene',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.language': 'Language',

    // Footer
    'footer.builtWith': 'Built with React, TypeScript, and Tailwind CSS',
    'footer.openSource': 'Open-source project for Midjourney prompt generation',

    // Toast Messages
    'toast.promptGenerated': 'Prompt generated successfully!',
    'toast.promptCopied': 'Copied to clipboard!',
    'toast.promptSaved': 'Prompt saved successfully!',
    'toast.promptDeleted': 'Prompt deleted!',
    'toast.promptImported': 'Prompt imported successfully!',
    'toast.favoriteAdded': 'Added to favorites!',
    'toast.favoriteRemoved': 'Removed from favorites!',
    'toast.groupCreated': 'Group created!',
    'toast.groupDeleted': 'Group deleted!',
    'toast.enterIdea': 'Please enter your idea first',
    'toast.searchError': 'Error searching prompts',
    'toast.templateSaved': 'Template saved!',
    'toast.templateDeleted': 'Template deleted!',
    'toast.templateApplied': 'Template applied!',

    // Advanced Parameters
    'advanced.title': 'Advanced Parameters',
    'advanced.toggle': 'Advanced Options',
    'advanced.stylize': 'Stylize (--s)',
    'advanced.stylizeDesc': '0-1000. Higher = more artistic, Lower = more literal',
    'advanced.chaos': 'Chaos (--c)',
    'advanced.chaosDesc': '0-100. Higher = more varied results',
    'advanced.weird': 'Weird (--weird)',
    'advanced.weirdDesc': '0-3000. Unique and quirky results',
    'advanced.quality': 'Quality (--q)',
    'advanced.qualityDesc': 'Rendering quality (0.25, 0.5, 1)',
    'advanced.seed': 'Seed (--seed)',
    'advanced.seedDesc': 'Same seed produces similar results',
    'advanced.tile': 'Tile (--tile)',
    'advanced.tileDesc': 'Create seamless patterns',
    'advanced.stop': 'Stop (--stop)',
    'advanced.stopDesc': '10-100. Stop early for unfinished look',

    // Negative Prompt
    'negative.title': 'Negative Prompt',
    'negative.placeholder': 'Elements to exclude (e.g., text, watermark, blur)',
    'negative.hint': 'Separate multiple items with commas',

    // SREF (Style Reference)
    'sref.title': 'Style Reference (SREF)',
    'sref.code': 'SREF Code',
    'sref.codePlaceholder': 'e.g., 12345678 or random',
    'sref.weight': 'Style Weight (--sw)',
    'sref.weightDesc': '0-1000. Style influence strength',
    'sref.hint': 'Enter numeric code or "random"',

    // Templates
    'template.title': 'Prompt Templates',
    'template.save': 'Save current settings as template',
    'template.name': 'Template Name',
    'template.namePlaceholder': 'e.g., My Fantasy Style',
    'template.empty': 'No saved templates',
    'template.emptyHint': 'Save your current settings as a template',
    'template.apply': 'Apply',
    'template.delete': 'Delete',

    // Prompt Analyzer
    'analyzer.title': 'Prompt Analyzer',
    'analyzer.input': 'Enter prompt to analyze',
    'analyzer.inputPlaceholder': 'Paste a Midjourney prompt...',
    'analyzer.analyze': 'Analyze',
    'analyzer.result': 'Analysis Result',
    'analyzer.subject': 'Subject',
    'analyzer.styles': 'Styles',
    'analyzer.moods': 'Moods',
    'analyzer.params': 'Parameters',
    'analyzer.modifiers': 'Modifiers',
    'analyzer.useThis': 'Use these settings',
  }
};

export function getTranslation(lang: Language, key: string): string {
  return translations[lang][key] || key;
}

export default translations;
