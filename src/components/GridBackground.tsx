import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  className?: string;
  opacity?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function GridBackground({
  className,
  opacity = 50,
  size = 'md'
}: GridBackgroundProps) {
  const sizes = {
    sm: '1rem 1rem',
    md: '4rem 4rem',
    lg: '6rem 6rem'
  };

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none bg-grid-pattern z-0',
        className
      )}
      style={{
        opacity: opacity / 100,
        backgroundSize: sizes[size]
      }}
    />
  );
}
