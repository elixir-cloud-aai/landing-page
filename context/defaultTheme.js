import React from 'react';

const themeContext = React.createContext('light');
export const ThemeProvider = themeContext.Provider;
export default themeContext;
