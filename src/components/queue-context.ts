import { createContext } from 'react';
import type { Song } from '@/lib/song';

export type QueueContextType = {
  queue: Song[];
  count: number;
  isQueued: (id: string) => boolean;
  addToQueue: (song: Song) => void;
  removeFromQueue: (id: string) => void;
  reorder: (activeId: string, overId: string) => void;
  clearQueue: () => void;
};

export const QueueContext = createContext<QueueContextType | undefined>(undefined);
