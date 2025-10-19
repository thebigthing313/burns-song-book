import type { Song } from '@/lib/song';
import { Item, ItemActions, ItemContent } from './ui/item';

interface SongCardProps {
  song: Song;
  className?: string;
  style: React.CSSProperties; // <-- NEW
}

export function SongCard({ song, className, style }: SongCardProps) {
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
      <ItemActions>
        <span className='w-fit text-xs text-muted-foreground'>
          {(() => {
            // song.length is milliseconds -> convert to mm:ss
            const totalSeconds = Math.floor((song.length ?? 0) / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
          })()}
        </span>
      </ItemActions>
    </Item>
  );
}
