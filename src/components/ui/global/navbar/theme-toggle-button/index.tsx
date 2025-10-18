'use client';

import { HiMoon, HiSun } from 'react-icons/hi2';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type StartPosition =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface ThemeToggleButtonProps {
  showLabel?: boolean;
  start?: StartPosition;
  className?: string;
}

export const ThemeToggleButton = ({
  showLabel = false,
  start = 'center',
  className,
}: ThemeToggleButtonProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = useCallback(() => {
    // Inject animation styles for this specific transition
    const styleId = `theme-transition-${Date.now()}`;
    const style = document.createElement('style');
    style.id = styleId;

    const positions = {
      center: 'center',
      'top-left': 'top left',
      'top-right': 'top right',
      'bottom-left': 'bottom left',
      'bottom-right': 'bottom right',
    };

    const cx = start === 'center' ? '50' : start.includes('left') ? '0' : '100';
    const cy = start === 'center' ? '50' : start.includes('top') ? '0' : '100';

    const css = `
      @supports (view-transition-name: root) {
        ::view-transition-old(root) { 
          animation: none;
        }
        ::view-transition-new(root) {
          animation: circle-blur-expand 0.5s ease-out;
          transform-origin: ${positions[start]};
          filter: blur(0);
        }
        @keyframes circle-blur-expand {
          from {
            clip-path: circle(0% at ${cx}% ${cy}%);
            filter: blur(4px);
          }
          to {
            clip-path: circle(150% at ${cx}% ${cy}%);
            filter: blur(0);
          }
        }
      }
    `;

    style.textContent = css;
    document.head.appendChild(style);

    // Clean up animation styles after transition
    setTimeout(() => {
      const styleEl = document.getElementById(styleId);
      if (styleEl) {
        styleEl.remove();
      }
    }, 3000);

    // Toggle theme with View Transition API
    if ('startViewTransition' in document) {
      (document as unknown as { startViewTransition: (callback: () => void) => void }).startViewTransition(() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      });
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  }, [theme, setTheme, start]);

  // Render a placeholder button during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size={showLabel ? 'default' : 'icon'}
        className={cn(
          'relative overflow-hidden transition-all',
          showLabel && 'gap-2',
          className
        )}
        disabled
        aria-label="Theme toggle"
      >
        <HiSun className="h-[1.2rem] w-[1.2rem] opacity-0" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={showLabel ? 'default' : 'icon'}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden transition-all',
        showLabel && 'gap-2',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <HiSun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <HiMoon className="h-[1.2rem] w-[1.2rem]" />
      )}
      {showLabel && (
        <span className="text-sm">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
};