import { ChevronsUpDown, ListMusic, Mic, Music, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect, useMemo, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useSongs } from './hooks/use-songs';
import { Drawer, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerContent, DrawerClose } from './ui/drawer';
import { Label } from './ui/label';
import { ButtonGroup, ButtonGroupText } from './ui/button-group';
import { Input } from './ui/input';

interface SearchBarProps {
  className?: string;
}
export function SearchBar({ className }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { headerType, filterGenre, filterArtist, filterSongName } = useSongs();

  const placeholder = () => {
    switch (headerType) {
      case 'artist':
        return 'Search by artist...';
      case 'name':
        return 'Search by song name...';
      case 'genre':
        return 'Search by genre...';
    }
  };

  // perform the actual filter based on current headerType
  const doFilter = useCallback(
    (value: string) => {
      switch (headerType) {
        case 'artist':
          filterArtist(value);
          break;
        case 'name':
          filterSongName(value);
          break;
        case 'genre':
          filterGenre(value);
          break;
      }
    },
    [headerType, filterArtist, filterSongName, filterGenre]
  );

  // create a debounced version of doFilter; recreate when doFilter changes
  const debouncedFilter = useMemo(() => debounce((v: string) => doFilter(v), 300), [doFilter]);

  // cancel debounced calls on unmount or when deps change
  useEffect(() => {
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter]);

  // called for normal typing: update local input state immediately, but debounce filter
  function handleSearchChange(value: string) {
    setSearchTerm(value);
    debouncedFilter(value);
  }

  // called for immediate apply/reset: cancel debounce and apply filter now
  function applyFilterNow(value: string) {
    debouncedFilter.cancel();
    doFilter(value);
  }

  return (
    <form
      className={className}
      onReset={() => {
        setSearchTerm('');
        applyFilterNow('');
      }}
    >
      <div className='grid w-full gap-6'>
        <ButtonGroup className='w-full' orientation='horizontal'>
          <ButtonGroupText>
            <SortDrawer />
          </ButtonGroupText>

          <Input value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} type='text' placeholder={placeholder()} />
          <ButtonGroupText>
            <Button variant='ghost' size='icon-sm' type='reset'>
              <RefreshCcw />
            </Button>
          </ButtonGroupText>
        </ButtonGroup>
      </div>
    </form>
  );
}

function SortDrawer() {
  const { groupBy, headerType } = useSongs();

  const SortIcon = () => {
    switch (headerType) {
      case 'artist':
        return <Mic />;
      case 'name':
        return <Music />;
      case 'genre':
        return <ListMusic />;
    }
  };

  //   className='rounded-none border-r-1 hover:bg-background'

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button aria-label='Search Type' variant='ghost' size='icon-sm'>
          <SortIcon />
          <ChevronsUpDown />
        </Button>
      </DrawerTrigger>
      <DrawerHeader className='sr-only'>
        <DrawerTitle>Filter</DrawerTitle>
        <DrawerDescription>Search for a song</DrawerDescription>
      </DrawerHeader>
      <DrawerContent className='p-4'>
        <div className='mx-auto w-full max-w-sm flex flex-col gap-4'>
          <Label>Sort By:</Label>
          <DrawerClose asChild>
            <Button
              onClick={() => {
                groupBy('artist');
              }}
            >
              Artist
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={() => {
                groupBy('name');
              }}
            >
              Song Title
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button
              onClick={() => {
                groupBy('genre');
              }}
            >
              Genre
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
