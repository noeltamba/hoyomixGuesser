import { Track, TrackHint, GameId } from './types';

// Helper to parse key-value text format from data.txt
export function parseTrackTxt(rawText: string, folderName: string): Track {
  const lines = rawText.split(/\r?\n/);
  const dict: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx !== -1) {
      const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
      const val = trimmed.slice(colonIdx + 1).trim();
      dict[key] = val;
    }
  }

  const title = dict['title'] || folderName;
  const gameId = (dict['game'] || 'genshin').toLowerCase() as GameId;
  const album = (dict['album'] || 'HOYO-MiX Album').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
  const composer = dict['composer'] || 'HOYO-MiX';
  let regionId = (dict['region'] || 'mondstadt').toLowerCase().replace(/\s+/g, '_');
  if (regionId === 'gaa') regionId = 'golden_apple_archipelago';
  const subAreaId = (dict['subarea'] || dict['sub_area'] || '').toLowerCase().replace(/\s+/g, '_');
  
  const rawContext = (dict['context'] || dict['time'] || 'day').toLowerCase();
  let timeContext: 'day' | 'night' | 'battle' | 'indoor' = 'day';
  if (rawContext.includes('night')) timeContext = 'night';
  else if (rawContext.includes('combat') || rawContext.includes('battle') || rawContext.includes('boss')) timeContext = 'battle';
  else if (rawContext.includes('indoor') || rawContext.includes('tavern')) timeContext = 'indoor';
  else timeContext = 'day';

  const description = dict['description'] || `Soundtrack from ${album}.`;
  const tags = dict['tags'] ? dict['tags'].split(',').map((t) => t.trim()) : [];

  // Build structured hint cards
  const hints: TrackHint[] = [
    { label: 'Initials', value: title.split(' ').map((w) => w[0]).join('. ') },
    { label: 'Album', value: album }
  ];

  if (dict['character']) {
    hints.push({ label: 'Associated Character', value: dict['character'] });
  }
  if (dict['item']) {
    hints.push({ label: 'Identical Item', value: dict['item'] });
  }
  if (dict['atmosphere'] || dict['mood']) {
    hints.push({ label: 'Atmosphere', value: dict['atmosphere'] || dict['mood'] });
  }

  // Determine audio URL (Cloudflare R2 CDN base, explicit audio URL in data.txt, or local fallback)
  const defaultR2 = 'https://pub-03c826d15ae3488fbeb22b9ff3af9800.r2.dev';
  const cdnBase = (import.meta.env.VITE_AUDIO_CDN_URL || defaultR2).replace(/\/+$/, '');
  let audioUrl = dict['audio'] || dict['audiourl'] || '';
  if (!audioUrl) {
    audioUrl = `${cdnBase}/${folderName}.mp3`;
  } else if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://') && !audioUrl.startsWith('/')) {
    audioUrl = `${cdnBase}/${audioUrl}`;
  }

  return {
    id: `track_${folderName}`,
    title,
    gameId,
    album,
    composer,
    audioUrl,
    regionId,
    subAreaId,
    timeContext,
    description,
    tags,
    hints
  };
}

// Automatically import data.txt files using Vite glob with ?raw query
const rawTxtModules = import.meta.glob('../songs/*/data.txt', {
  query: '?raw',
  import: 'default',
  eager: true
});

export const TRACKS: Track[] = Object.entries(rawTxtModules).map(([path, rawContent]) => {
  // Path format: .../public/songs/{folderName}/data.txt
  const parts = path.replace(/\\/g, '/').split('/');
  const folderName = parts[parts.length - 2];
  return parseTrackTxt(rawContent as string, folderName);
});
