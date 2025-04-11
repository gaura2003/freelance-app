import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";

const MainLayout = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      <Navbar />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
