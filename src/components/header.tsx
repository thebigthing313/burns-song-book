import { Link } from 'react-router-dom';
import { ListMusic } from 'lucide-react';
import { Typography } from './typography';
import { useSongs } from './hooks/use-songs';
import { useQueue } from './hooks/use-queue';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { count } = useSongs();
  const { count: queueCount } = useQueue();

  return (
    <header className={className}>
      <div className='flex flex-row gap-2 items-baseline text-accent-foreground'>
        <Typography tag='h1'>Song Book</Typography>
        <span className='text-muted-foreground text-xs'>{`(${count} songs)`}</span>
      </div>
      <div className='flex flex-row items-center gap-1'>
        <Button asChild variant='ghost' size='sm' aria-label={`View queue (${queueCount} songs)`}>
          <Link to='/queue' className='relative'>
            <ListMusic />
            Queue
            {queueCount > 0 && (
              <span className='absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground tabular-nums'>
                {queueCount > 99 ? '99+' : queueCount}
              </span>
            )}
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
