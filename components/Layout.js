import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { DarkModeProvider } from "../context/darkMode";

function Layout({ children }) {
  const [scroll, setScroll] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    window.onscroll = () => {
      setScroll(window.scrollY);
    };
  });

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("bg-gray-800");
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav>
        <NavBar
          scroll={scroll}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />
      </nav>
      <main className="flex-grow mt-5 mb-10">
        <DarkModeProvider value={darkMode}>{children}</DarkModeProvider>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
