import { SearchIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Typography } from './typography';
import { useSongs } from './hooks/use-songs';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { Label } from './ui/label';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { count } = useSongs();
  return (
    <header className={className}>
      <div className='flex flex-row gap-2 items-baseline text-accent-foreground'>
        <Typography tag='h1'>Song Book</Typography>
        <span className='text-muted-foreground text-xs'>{`(${count} songs)`}</span>
      </div>
      <SortDrawer />
    </header>
  );
}

function SortDrawer() {
  const { groupBy } = useSongs();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className='bg-primary/50 shadow-accent shadow-2xl' aria-label='Search' variant='default' size='icon'>
          <SearchIcon />
        </Button>
      </DrawerTrigger>
      <DrawerHeader className='sr-only'>
        <DrawerTitle>Filter</DrawerTitle>
        <DrawerDescription>Search for a song</DrawerDescription>
      </DrawerHeader>
      <DrawerContent className='p-4'>
        <div className='mx-auto w-full max-w-sm flex flex-col gap-4'>
          <Label>Sort By:</Label>
          <Button
            onClick={() => {
              groupBy('artist');
            }}
          >
            Artist
          </Button>
          <Button
            onClick={() => {
              groupBy('name');
            }}
          >
            Song Title
          </Button>
          <Button
            onClick={() => {
              groupBy('genre');
            }}
          >
            Genre
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
