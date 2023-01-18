import { useEffect, useState } from 'react';
import Footer from './Footer';
import NavBar from './NavBar';
import { DarkModeProvider } from '../context/darkMode';

function Layout({ children }) {
  const [scroll, setScroll] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('DARK_MODE');
    if (storedTheme === 'true') {
      document.body.classList.toggle('dark');
      document.body.classList.toggle('bg-gray-800');
    }
    if (storedTheme !== null) {
      setDarkMode(storedTheme === 'true');
    }
  }, []);

  useEffect(() => {
    window.onscroll = () => {
      setScroll(window.scrollY);
    };
  });

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('bg-gray-800');
    localStorage.setItem('DARK_MODE', !darkMode);
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col min-h-screen">
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
