import { capitalize } from 'lodash';

interface StickyGroupCardProps {
  field: string;
  value: string;
  count: number;
  switchCollapsed?: () => void;
  style: React.CSSProperties; // <-- NEW
}

export function StickyGroupCard({ field, value, count, style }: StickyGroupCardProps) {
  // Removed isSticky prop since the logic is now handled by the inline 'style' prop
  // The height is also handled by 'style'
  return (
    <div
      // Apply the dynamic style object here
      style={style}
      // Apply static Tailwind classes here
      className='grid grid-flow-col place-items-center justify-between bg-primary text-primary-foreground text-xs z-1 px-2'
    >
      <span className='flex w-full justify-center font-semibold truncate'>
        {capitalize(field)}: {value}
      </span>
      <span className='font-light'>
        {count} song{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
