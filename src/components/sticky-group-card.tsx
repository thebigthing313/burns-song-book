import { capitalize } from 'lodash';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface StickyGroupCardProps {
  field: string;
  value: string;
  count: number;
  // Controlled collapsed state (optional)
  isCollapsed?: boolean;
  // Callback when collapsed state changes
  onCollapsedChange?: (collapsed: boolean) => void;
  // Legacy callback compatibility
  switchCollapsed?: () => void;
  style: React.CSSProperties; // <-- NEW
}

export function StickyGroupCard({
  field,
  value,
  count,
  isCollapsed: isCollapsedProp,
  onCollapsedChange,
  switchCollapsed,
  style
}: StickyGroupCardProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = typeof isCollapsedProp === 'boolean' ? isCollapsedProp : internalCollapsed;

  const handleToggle = () => {
    const next = !isCollapsed;
    if (typeof isCollapsedProp === 'boolean') {
      onCollapsedChange?.(next);
    } else {
      setInternalCollapsed(next);
      onCollapsedChange?.(next);
    }
    switchCollapsed?.();
  };

  return (
    <div
      style={style}
      className='grid grid-flow-col place-items-center justify-between bg-primary text-primary-foreground text-xs z-1 px-2'
    >
      <span className='flex w-full justify-center font-semibold truncate'>
        {capitalize(field)}: {value}
      </span>
      <div className='grid grid-flow-col gap-0 items-center'>
        <span className='font-light'>
          {count} song{count !== 1 ? 's' : ''}
        </span>
        <Button variant='ghost' size='icon' onClick={handleToggle} aria-expanded={!isCollapsed}>
          <ChevronDown className={isCollapsed ? 'rotate-180' : ''} />
        </Button>
      </div>
    </div>
  );
}
