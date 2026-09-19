export type GameId = 'genshin' | 'hsr' | 'zzz';

export interface SubArea {
  id: string;
  name: string;
  image?: string;
}

export interface Region {
  id: string;
  name: string;
  subtitle?: string;
  logo: string;
  subAreas: SubArea[];
}

export interface GameInfo {
  id: GameId;
  name: string;
  tagline: string;
  themeColor: string;
  regions: Region[];
}

export interface TimeContext {
  id: 'day' | 'night' | 'battle' | 'indoor';
  name: string;
  desc: string;
}

export interface TrackHint {
  label: string;
  value: string;
}

export interface Track {
  id: string;
  title: string;
  gameId: GameId;
  album: string;
  composer: string;
  audioUrl: string;
  regionId: string;
  subAreaId: string;
  timeContext: 'day' | 'night' | 'battle' | 'indoor';
  description: string;
  tags: string[];
  hints?: TrackHint[];
  coverImage?: string;
}

export type StageId = 1 | 2 | 3 | 4 | 5;

export interface FeedbackState {
  type: 'correct' | 'wrong' | 'info';
  message: string;
  subMessage?: string;
}
