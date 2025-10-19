import { SearchX } from 'lucide-react';
import { useSongs } from './hooks/use-songs';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty';

interface EmptyMainProps {
  className?: string;
}
export function EmptyMain({ className }: EmptyMainProps) {
  const { headerType } = useSongs();

  const message = () => {
    switch (headerType) {
      case 'artist':
        return 'No artists found.';
      case 'name':
        return 'No songs found.';
      case 'genre':
        return 'No genres found.';
    }
  };
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>{message()}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
