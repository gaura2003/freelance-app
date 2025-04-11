import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MembershipProvider } from "./contexts/MembershipContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MembershipProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </MembershipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
