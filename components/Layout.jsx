import { useEffect, useState } from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import { DarkModeProvider } from '../context/darkMode';

function Layout({ children }) {
  const [scroll, setScroll] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('dark-theme');
    if (storedTheme !== null) {
      setDarkMode(storedTheme === 'true');
    }
    setShowBanner(!localStorage.getItem('banner-status'));
  }, []);

  useEffect(() => {
    window.onscroll = () => {
      setScroll(window.scrollY);
    };
  });

  const toggleDarkMode = () => {
    localStorage.setItem('dark-theme', !darkMode);
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`flex flex-col min-h-screen body ${
        darkMode ? 'dark bg-gray-800' : ''
      }`}
    >
      <nav>
        <NavBar
          darkMode={darkMode}
          scroll={scroll}
          setShowBanner={setShowBanner}
          showBanner={showBanner}
          toggleDarkMode={toggleDarkMode}
        />
      </nav>
      <main className={`flex-grow  mb-10 ${showBanner ? 'mt-14 ' : ''}`}>
        <DarkModeProvider value={darkMode}>{children}</DarkModeProvider>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
