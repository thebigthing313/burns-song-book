import { createContext } from 'react';
import type { Song } from '../lib/song';

export type GroupField = 'artist' | 'genre' | 'name';
export type Grouping = {
  field: GroupField;
  value: string;
  count: number;
};

export type SongContextType = {
  originalSongs: Song[];
  songs: Array<Song>;
  rows: Array<Song | Grouping>;
  headers: string[];
  stickyIndexes: number[];
  headerType: GroupField;
  count: number;
  groupBy: (field: GroupField) => void;
  filterArtist: (search: string) => void;
  filterSongName: (search: string) => void;
  filterGenre: (search: string) => void;
};

export const SongContext = createContext<SongContextType | undefined>(undefined);
