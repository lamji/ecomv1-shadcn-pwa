'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import theme, { generateCSSVars } from '@/lib/theme';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof theme.colors;
  semantic: typeof theme.semantic;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark';
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(defaultTheme === 'dark');

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply CSS variables
    const cssVars = generateCSSVars(isDark);
    const style = document.createElement('style');
    style.textContent = `:root { ${cssVars} }`;
    style.id = 'theme-variables';

    // Remove existing theme variables
    const existingStyle = document.getElementById('theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    isDark,
    toggleTheme,
    colors: isDark ? theme.dark : theme.colors,
    semantic: theme.semantic,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
