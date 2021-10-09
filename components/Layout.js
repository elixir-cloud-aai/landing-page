import { useState, useEffect } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Layout = ({ children }) => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    window.onscroll = () => {
      setScroll(window.scrollY);
    };
  });

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <nav>
          <NavBar scroll={scroll} />
        </nav>
        <main className="flex-grow mb-10">{children}</main>
        <footer>
          <Footer></Footer>
        </footer>
      </div>
    </>
  );
};

export default Layout;
