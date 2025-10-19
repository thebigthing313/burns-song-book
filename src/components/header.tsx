import { Typography } from './typography';
import { useSongs } from './hooks/use-songs';
import { ModeToggle } from './mode-toggle';

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
      <ModeToggle />
    </header>
  );
}
