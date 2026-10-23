'use client';

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';
import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

export interface AnimatedGridPatternProps extends ComponentPropsWithoutRef<'svg'> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

type Square = {
  id: number;
  pos: [number, number];
  iteration: number;
};

const squareColors = ['#facc15', '#22c55e', '#ef4444', '#3b82f6'];

interface AnimatedSquareProps {
  square: Square;
  index: number;
  width: number;
  height: number;
  maxOpacity: number;
  duration: number;
  repeatDelay: number;
  onComplete: (id: number) => void;
}

// Memoized so that one square finishing only re-renders that square.
const AnimatedSquare = memo(function AnimatedSquare({
  square: { id, pos, iteration },
  index,
  width,
  height,
  maxOpacity,
  duration,
  repeatDelay,
  onComplete,
}: AnimatedSquareProps) {
  const [opacity] = useState(() => 0.5 + (maxOpacity - 0.5) * Math.random());
  return (
    <motion.rect
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{
        duration,
        repeat: 1,
        delay: iteration === 0 ? index * 0.1 : 0,
        repeatType: 'reverse',
        repeatDelay,
      }}
      onAnimationComplete={() => onComplete(id)}
      width={width - 1}
      height={height - 1}
      x={pos[0] * width + 1}
      y={pos[1] * height + 1}
      fill={squareColors[(id + iteration) % squareColors.length]}
      strokeWidth="0"
    />
  );
});

export function AnimatedGridPattern({
  width = 70,
  height = 70,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 24,
  className,
  maxOpacity = 1,
  duration = 2,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const [hasSize, setHasSize] = useState(false);
  const [squares, setSquares] = useState<Array<Square>>([]);
  const [isActive, setIsActive] = useState(false);
  const reduceMotion = useReducedMotion();

  const getPos = useCallback((): [number, number] => {
    const { width: w, height: h } = dimensionsRef.current;
    return [
      Math.floor((Math.random() * w) / width),
      Math.floor((Math.random() * h) / height),
    ];
  }, [height, width]);

  const updateSquarePosition = useCallback(
    (squareId: number) => {
      setSquares((currentSquares) => {
        const current = currentSquares[squareId];
        if (!current) return currentSquares;
        const nextSquares = currentSquares.slice();
        nextSquares[squareId] = {
          ...current,
          pos: getPos(),
          iteration: current.iteration + 1,
        };
        return nextSquares;
      });
    },
    [getPos],
  );

  useEffect(() => {
    if (hasSize) {
      setSquares(
        Array.from({ length: numSquares }, (_, i) => ({
          id: i,
          pos: getPos(),
          iteration: 0,
        })),
      );
    }
  }, [hasSize, getPos, numSquares]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      dimensionsRef.current = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };
      setHasSize(entry.contentRect.width > 0 && entry.contentRect.height > 0);
    });
    resizeObserver.observe(element);

    // Only animate while the pattern is on screen and the tab is visible.
    let onScreen = false;
    const update = () =>
      setIsActive(onScreen && document.visibilityState === 'visible');
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    intersectionObserver.observe(element);
    document.addEventListener('visibilitychange', update);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  const animate = isActive && !reduceMotion;

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full stroke-gray-400/35 dark:stroke-white/10',
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      {animate && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map((square, index) => (
            <AnimatedSquare
              key={`${square.id}-${square.iteration}`}
              square={square}
              index={index}
              width={width}
              height={height}
              maxOpacity={maxOpacity}
              duration={duration}
              repeatDelay={repeatDelay}
              onComplete={updateSquarePosition}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
