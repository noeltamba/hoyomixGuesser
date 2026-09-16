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
  const album = dict['album'] || 'HOYO-MiX Album';
  const composer = dict['composer'] || 'HOYO-MiX';
  let regionId = (dict['region'] || 'mondstadt').toLowerCase().replace(/\s+/g, '_');
  if (regionId === 'gaa') regionId = 'golden_apple_archipelago';
  const subAreaId = (dict['subarea'] || dict['sub_area'] || '').toLowerCase().replace(/\s+/g, '_');
  const timeContext = (dict['context'] || dict['time'] || 'day').toLowerCase() as 'day' | 'night' | 'battle' | 'indoor';
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

  return {
    id: `track_${folderName}`,
    title,
    gameId,
    album,
    composer,
    audioUrl: `/songs/${folderName}/audio.mp3`,
    regionId,
    subAreaId,
    timeContext,
    description,
    tags,
    hints
  };
}

// Automatically import data.txt files using Vite glob with ?raw query
const rawTxtModules = import.meta.glob('../../public/songs/*/data.txt', {
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
