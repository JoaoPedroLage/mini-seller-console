'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/app/contexts/theme-context';
import { Button } from './button';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  // Safe access to theme context
  let theme: 'light' | 'dark' = 'light';
  let toggleTheme: () => void = () => {};
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch {
    // Handle context not being available (e.g., during SSR)
    console.warn("Theme context not available, using default light theme");
  }
  
  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
    setCurrentTheme(theme);
  }, [theme]);

  // Only render toggle after hydration to avoid mismatch
  if (!mounted) {
    return null; // Return empty during SSR and first render
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative p-2"
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon for light mode */}
        <svg
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 transform ${
            currentTheme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        
        {/* Moon icon for dark mode */}
        <svg
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 transform ${
            currentTheme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
      
      <span className="sr-only">
        {currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </Button>
  );
}
