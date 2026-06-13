import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { Song } from '@/lib/song';
import { QueueContext, type QueueContextType } from './queue-context';

const STORAGE_KEY = 'burns-song-book-queue';

function loadQueue(): Song[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Song[]) : [];
  } catch {
    return [];
  }
}

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Song[]>(loadQueue);

  // Mirror the queue in a ref so the action callbacks can read the latest
  // state without depending on it (keeps their identities stable).
  const queueRef = useRef(queue);
  queueRef.current = queue;

  // Persist to localStorage on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch {
      // Ignore write failures (e.g. private mode / quota).
    }
  }, [queue]);

  const isQueued = useCallback((id: string) => queue.some((song) => song.id === id), [queue]);

  const addToQueue = useCallback((song: Song) => {
    if (queueRef.current.some((s) => s.id === song.id)) return;
    setQueue((prev) => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    if (!queueRef.current.some((s) => s.id === id)) return;
    setQueue((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const reorder = useCallback((activeId: string, overId: string) => {
    const current = queueRef.current;
    const oldIndex = current.findIndex((s) => s.id === activeId);
    const newIndex = current.findIndex((s) => s.id === overId);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;
    setQueue((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  const clearQueue = useCallback(() => {
    if (queueRef.current.length === 0) return;
    setQueue([]);
  }, []);

  const value = useMemo<QueueContextType>(
    () => ({
      queue,
      count: queue.length,
      isQueued,
      addToQueue,
      removeFromQueue,
      reorder,
      clearQueue
    }),
    [queue, isQueued, addToQueue, removeFromQueue, reorder, clearQueue]
  );

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}
