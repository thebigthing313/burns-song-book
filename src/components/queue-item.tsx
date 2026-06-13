import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical } from 'lucide-react';
import type { Song } from '@/lib/song';
import { cn, formatDuration } from '@/lib/utils';
import { Item, ItemActions, ItemContent, ItemMedia } from './ui/item';
import { Button } from './ui/button';

interface QueueItemProps {
  song: Song;
  position: number;
  onDone: (id: string) => void;
}

export function QueueItem({ song, position, onDone }: QueueItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: song.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative'
  };

  return (
    <Item
      ref={setNodeRef}
      variant='outline'
      style={style}
      className={cn('bg-background touch-none select-none', isDragging && 'opacity-80 shadow-lg')}
      // Long-press (touch) / click-drag (mouse) anywhere on the card starts a reorder.
      {...attributes}
      {...listeners}
    >
      <ItemMedia variant='default' className='text-muted-foreground'>
        <span className='text-xs tabular-nums w-5 text-center'>{position}</span>
        <GripVertical className='size-4' />
      </ItemMedia>
      <ItemContent className='flex flex-col gap-0 text-sm tracking-tight truncate'>
        <div className='font-semibold'>{song.name}</div>
        <div>{song.artist}</div>
        <div className='text-xs italic'>
          {song.album} ({song.year})
        </div>
        <div className='text-xs'>{song.genre}</div>
      </ItemContent>
      <ItemActions className='flex flex-col items-end gap-1'>
        <span className='w-fit text-xs text-muted-foreground'>{formatDuration(song.length)}</span>
        <Button
          variant='outline'
          size='icon-sm'
          aria-label={`Mark "${song.name}" as done`}
          // Stop the drag sensors from swallowing the tap, then mark done.
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDone(song.id)}
        >
          <Check />
        </Button>
      </ItemActions>
    </Item>
  );
}
