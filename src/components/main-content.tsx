import { type CSSProperties, useCallback, useRef, useState, useMemo, useEffect, useTransition } from 'react';
import { useSongs } from './hooks/use-songs';
import { SongCard } from './song-card';
import type { Range } from '@tanstack/react-virtual';
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { capitalize } from 'lodash';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Button } from './ui/button';

interface MainContentProps {
  className?: string;
}

export function MainContent({ className }: MainContentProps) {
  const { groupedSongs, headerType, filterGenre, filterArtist, filterSongName } = useSongs();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const parentRef = useRef<HTMLDivElement>(null);
  // Map of collapsed state per group (keyed by group value)
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const measureTimeoutRef = useRef<number | null>(null);

  const searchLabel = useMemo(() => {
    switch (headerType) {
      case 'artist':
        return 'Search by artist';
      case 'name':
        return 'Search by song name';
      case 'genre':
        return 'Search by genre';
      default:
        return 'Search';
    }
  }, [headerType]);

  const isGroupCollapsed = (key: string) => !!collapsedMap[key];
  const setGroupCollapsed = (key: string, next: boolean) => {
    startTransition(() => {
      setCollapsedMap((prev) => ({ ...prev, [key]: next }));
    });
  };

  // Build ordered list of groups from the groupedSongs dictionary
  const groupEntries = useMemo(() => {
    return Object.keys(groupedSongs).map((key) => ({ key, grouping: groupedSongs[key].grouping, songs: groupedSongs[key].songs }));
  }, [groupedSongs]);

  const rowVirtualizer = useVirtualizer({
    count: groupEntries.length,
    estimateSize: useCallback(
      (index: number) => {
        const g = groupEntries[index];
        const isCollapsed = !!collapsedMap[g.key];
        const headerHeight = 42; // trigger/header height with padding
        const songHeight = 105; // song card height (Item component with content, padding, and border)
        // When expanded, return header + all songs; when collapsed, return just header
        return isCollapsed ? headerHeight : headerHeight + g.songs.length * songHeight;
      },
      [groupEntries, collapsedMap]
    ),
    getScrollElement: () => parentRef.current,
    rangeExtractor: useCallback((range: Range) => [...defaultRangeExtractor(range)], []),
    // Measure actual element heights for accuracy
    measureElement: (element) => element.getBoundingClientRect().height
  });

  // Trigger remeasurement when collapsed state changes
  useEffect(() => {
    // Debounce measurement to avoid multiple rapid updates
    if (measureTimeoutRef.current !== null) {
      window.clearTimeout(measureTimeoutRef.current);
    }

    measureTimeoutRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        rowVirtualizer.measure();
      });
    }, 50); // 50ms debounce

    return () => {
      if (measureTimeoutRef.current !== null) {
        window.clearTimeout(measureTimeoutRef.current);
      }
    };
  }, [collapsedMap, rowVirtualizer]);

  return (
    <main className={className}>
      <div className='grid gap-2 pb-2'>
        <Label>{searchLabel}</Label>
        <InputGroup>
          <InputGroupInput
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              switch (headerType) {
                case 'artist':
                  filterArtist(e.target.value);
                  break;
                case 'name':
                  filterSongName(e.target.value);
                  break;
                case 'genre':
                  filterGenre(e.target.value);
                  break;
              }
            }}
            type='text'
            placeholder='Search...'
          />
          <InputGroupAddon align='inline-end'>
            <Button variant='ghost' size='icon-lg'>
              <RefreshCw />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div ref={parentRef} className='overflow-auto h-full'>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const entry = groupEntries[virtualRow.index];

            const baseStyle: CSSProperties = {
              position: 'absolute',
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`
            };

            const { key, grouping, songs } = entry;
            const header = grouping;
            const isCollapsed = isGroupCollapsed(key);

            return (
              <div key={key} style={baseStyle} data-index={virtualRow.index}>
                <Collapsible open={!isCollapsed} onOpenChange={(open) => setGroupCollapsed(key, !open)} className='flex flex-col h-full'>
                  <div className='grid grid-flow-col place-items-center justify-between bg-primary text-primary-foreground text-xs z-1 px-2'>
                    <div className='flex w-full justify-center font-semibold truncate'>
                      {capitalize(header.field)}: {header.value}
                    </div>
                    <div className='grid grid-flow-col gap-0 items-center'>
                      <span className='font-light'>
                        {header.count} song{header.count !== 1 ? 's' : ''}
                      </span>
                      <CollapsibleTrigger asChild>
                        <button aria-label={`Toggle ${header.value}`} className='p-1'>
                          <ChevronDown className={!isCollapsed ? 'rotate-180' : ''} />
                        </button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  <CollapsibleContent className='flex flex-col'>
                    {!isCollapsed && songs.map((song) => <SongCard key={song.id} song={song} className='rounded-none' style={{}} />)}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
