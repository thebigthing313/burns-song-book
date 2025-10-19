import { useContext } from 'react';
import { SongContext } from '../song-context';
import type { SongContextType } from '../song-context';

export function useSongs(): SongContextType {
  const ctx = useContext(SongContext);
  if (!ctx) {
    throw new Error('useSongs must be used within a SongProvider');
  }
  return ctx;
}
