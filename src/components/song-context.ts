import { createContext } from 'react';
import type { Song } from '../lib/song';
import type { Dictionary } from 'lodash';

export type GroupField = 'artist' | 'genre' | 'name';
export type Grouping = {
  field: GroupField;
  value: string;
  count: number;
};

export type SongContextType = {
  originalSongs: Song[];
  songs: Array<Song>;
  // Keyed collection where each key maps to grouping metadata and its songs
  groupedSongs: Dictionary<{ grouping: Grouping; songs: Song[] }>;
  headerType: GroupField;
  count: number;
  groupBy: (field: GroupField) => void;
  filterArtist: (search: string) => void;
  filterSongName: (search: string) => void;
  filterGenre: (search: string) => void;
};

export const SongContext = createContext<SongContextType | undefined>(undefined);
