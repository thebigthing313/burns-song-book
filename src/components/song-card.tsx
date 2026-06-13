import type { Song } from '@/lib/song';
import { formatDuration } from '@/lib/utils';
import { Check, Plus } from 'lucide-react';
import { Item, ItemActions, ItemContent } from './ui/item';
import { Button } from './ui/button';
import { useQueue } from './hooks/use-queue';

interface SongCardProps {
  song: Song;
  className?: string;
  style: React.CSSProperties; // <-- NEW
}

export function SongCard({ song, className, style }: SongCardProps) {
  const { addToQueue, isQueued } = useQueue();
  const queued = isQueued(song.id);

  return (
    <Item variant='outline' className={className} style={style}>
      <ItemContent className='flex flex-col gap-0 text-sm tracking-tight truncate'>
        <div className='font-semibold'>{song.name}</div>
        <div className=''>{song.artist}</div>
        <div className='text-xs italic'>
          {song.album} ({song.year})
        </div>
        <div className='text-xs'>{song.genre}</div>
      </ItemContent>
      <ItemActions className='flex flex-col items-end gap-1'>
        <span className='w-fit text-xs text-muted-foreground'>{formatDuration(song.length)}</span>
        <Button
          variant={queued ? 'secondary' : 'outline'}
          size='icon-sm'
          aria-label={queued ? `${song.name} is in the queue` : `Add ${song.name} to queue`}
          disabled={queued}
          onClick={() => addToQueue(song)}
        >
          {queued ? <Check /> : <Plus />}
        </Button>
      </ItemActions>
    </Item>
  );
}
