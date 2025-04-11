import fs from 'fs';
import path from 'path';

const baseDir = process.cwd(); // your project root

// Define folder structure and files
const structure = [
  { dir: 'contexts', files: ['ThemeContext.jsx', 'AuthContext.jsx'] },
  { dir: 'hooks', files: ['useLocalStorage.js'] },
  { dir: 'layouts', files: ['MainLayout.jsx', 'AdminLayout.jsx'] },
  { dir: 'routes', files: ['AppRoutes.jsx'] },
  { dir: '', files: ['App.jsx'] } // Root-level App.jsx
];

// Template content for each file
const templates = {
  'ThemeContext.jsx': `import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
`,

  'AuthContext.jsx': `import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
`,

  'useLocalStorage.js': `import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
`,

  'MainLayout.jsx': `import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
`,

  'AdminLayout.jsx': `import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-grow p-4 bg-gray-100 dark:bg-gray-800">{children}</main>
    </div>
  );
};

export default AdminLayout;
`,

  'AppRoutes.jsx': `import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  );
};

export default AppRoutes;
`,

  'App.jsx': `import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
`
};

// Function to create folders and files
const createStructure = () => {
  structure.forEach(({ dir, files }) => {
    const dirPath = path.join(baseDir, dir);
    if (dir && !fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created folder: ${dirPath}`);
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const content = templates[file] || '';
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Created file: ${filePath}`);
    });
  });
};

createStructure();
