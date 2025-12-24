export type SearchMode = 'STRICT' | 'DISCOVERY';

export interface SonicArtist {
  name: string;
  genre: string;
  subGenre: string;
  style: string;
  nuancedSimilarities: string;
}

export interface InputAnalysis {
  artistOrSong: string;
  detectedGenre: string;
  sonicSignature: string;
  modeUsed: SearchMode;
}

export interface SearchResult {
  inputAnalysis: InputAnalysis;
  recommendations: SonicArtist[];
}