import { useEffect, useState } from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import { ThemeProvider } from '../context/darkMode';

function Layout({ children }) {
  const [scroll, setScroll] = useState(0);
  const [theme, setTheme] = useState('light');
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('dark-theme');
    if (storedTheme !== null) {
      setTheme(storedTheme);
    }
    setShowBanner(!localStorage.getItem('banner-status'));
  }, []);

  useEffect(() => {
    window.onscroll = () => {
      setScroll(window.scrollY);
    };
  });

  const toggleDarkMode = () => {
    localStorage.setItem('dark-theme', theme === 'light' ? 'dark' : 'light');
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      className={`flex flex-col min-h-screen body ${
        theme === 'dark' ? 'dark bg-gray-800' : ''
      }`}
    >
      <nav>
        <NavBar
          scroll={scroll}
          setShowBanner={setShowBanner}
          showBanner={showBanner}
          theme={theme}
          toggleDarkMode={toggleDarkMode}
        />
      </nav>
      <main className={`flex-grow  mb-10 ${showBanner ? 'mt-14 ' : ''}`}>
        <ThemeProvider value={{ theme, toggleDarkMode }}>
          {children}
        </ThemeProvider>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
