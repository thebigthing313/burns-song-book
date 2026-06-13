import { useContext } from 'react';
import { QueueContext } from '../queue-context';
import type { QueueContextType } from '../queue-context';

export function useQueue(): QueueContextType {
  const ctx = useContext(QueueContext);
  if (!ctx) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return ctx;
}
