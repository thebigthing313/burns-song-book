import { type CSSProperties, useCallback, useRef } from 'react';
import { useSongs } from './hooks/use-songs';
import { SongCard } from './song-card';
import type { Range } from '@tanstack/react-virtual';
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import type { Grouping } from './song-context';
import type { Song } from '@/lib/song';
import { StickyGroupCard } from './sticky-group-card';

interface MainContentProps {
  className?: string;
}

export function MainContent({ className }: MainContentProps) {
  const { rows, stickyIndexes } = useSongs();

  const parentRef = useRef<HTMLDivElement>(null);
  const activeStickyIndexRef = useRef(0);

  const isSticky = useCallback((index: number) => stickyIndexes.includes(index), [stickyIndexes]);
  const isActiveSticky = (index: number) => index === activeStickyIndexRef.current;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: useCallback(
      (index: number) => {
        return isSticky(index) ? 42 : 100;
      },
      [isSticky]
    ),
    getScrollElement: () => parentRef.current,
    rangeExtractor: useCallback(
      (range: Range) => {
        activeStickyIndexRef.current = [...stickyIndexes].reverse().find((index) => range.startIndex >= index) ?? 0;
        const next = new Set([activeStickyIndexRef.current, ...defaultRangeExtractor(range)]);
        return [...next].sort((a, b) => a - b);
      },
      [stickyIndexes]
    )
  });

  return (
    <main className={className}>
      <div ref={parentRef} className='overflow-auto h-full'>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = rows[virtualRow.index];
            const isHeader = isSticky(virtualRow.index);

            const baseStyle: CSSProperties = {
              position: isActiveSticky(virtualRow.index) ? 'sticky' : 'absolute',
              top: isActiveSticky(virtualRow.index) ? 0 : 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: isActiveSticky(virtualRow.index) ? undefined : `translateY(${virtualRow.start}px)`
            };

            if (isHeader) {
              const { field, value, count } = item as Grouping;
              const stickyStyle: CSSProperties = {
                zIndex: 1
              };

              if (isActiveSticky(virtualRow.index)) {
                return (
                  <StickyGroupCard
                    key={`header-${virtualRow.index}`}
                    field={field}
                    value={value}
                    count={count}
                    style={{ ...baseStyle, ...stickyStyle }}
                  />
                );
              } else {
                return <StickyGroupCard key={`header-${virtualRow.index}`} field={field} value={value} count={count} style={baseStyle} />;
              }
            } else {
              const song = item as Song;
              return <SongCard key={song.id} song={song} style={baseStyle} className={`rounded-none`} />;
            }
          })}
        </div>
      </div>
    </main>
  );
}
