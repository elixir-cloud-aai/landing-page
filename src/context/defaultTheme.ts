import React from 'react';

export type Theme = 'light' | 'dark';
export interface ThemeProps {
  theme: Theme;
  toggleDarkMode: () => void;
}

const themeContext = React.createContext<ThemeProps | null>(null);
export const ThemeProvider = themeContext.Provider;
export default themeContext;
