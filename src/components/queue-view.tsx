import { Link } from 'react-router-dom';
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowLeft, ListMusic, Trash2 } from 'lucide-react';
import { useQueue } from './hooks/use-queue';
import { QueueItem } from './queue-item';
import { Button } from './ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty';
import { cn } from '@/lib/utils';

interface QueueViewProps {
  className?: string;
}

export function QueueView({ className }: QueueViewProps) {
  const { queue, count, removeFromQueue, reorder, clearQueue } = useQueue();

  const sensors = useSensors(
    // Mouse: start dragging after a small movement so clicks still register.
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // Touch: long-press (250ms) then drag, matching the requested gesture.
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(String(active.id), String(over.id));
    }
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className='flex items-center justify-between gap-2 mb-4'>
        <Button asChild variant='ghost' size='sm'>
          <Link to='/'>
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <h2 className='flex items-center gap-2 font-semibold'>
          <ListMusic className='size-4' />
          Queue
          <span className='text-muted-foreground text-xs font-normal'>
            ({count} song{count !== 1 ? 's' : ''})
          </span>
        </h2>
        <Button variant='ghost' size='sm' disabled={count === 0} onClick={() => clearQueue()}>
          <Trash2 />
          <span className='sr-only sm:not-sr-only'>Clear</span>
        </Button>
      </div>

      {count === 0 ? (
        <Empty className='h-full border-2 border-dashed'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <ListMusic />
            </EmptyMedia>
            <EmptyTitle>Your queue is empty</EmptyTitle>
            <EmptyDescription>
              Add songs from the list with the <span className='font-medium'>+</span> button and they'll show up here.
            </EmptyDescription>
          </EmptyHeader>
          <Button asChild variant='outline' size='sm'>
            <Link to='/'>Browse songs</Link>
          </Button>
        </Empty>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={queue.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className='flex flex-col gap-2'>
              {queue.map((song, index) => (
                <QueueItem key={song.id} song={song} position={index + 1} onDone={removeFromQueue} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
