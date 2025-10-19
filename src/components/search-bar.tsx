import { RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { useState } from 'react';
import { useSongs } from './hooks/use-songs';

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

  function handleSearchChange(value: string) {
    setSearchTerm(value);
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
  }

  return (
    <form className={className} onReset={() => handleSearchChange('')}>
      <InputGroup>
        <InputGroupInput value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} type='text' placeholder={placeholder()} />
        <InputGroupAddon align='inline-end'>
          <Button variant='ghost' size='icon-lg' type='reset'>
            <RefreshCcw />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
