import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      {" "}
      {/* ✅ wrap here */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
