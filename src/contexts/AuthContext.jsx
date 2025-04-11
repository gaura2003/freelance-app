import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const isLoggedIn = localStorage.getItem("freelancehub_loggedIn") === "true";
    
    if (isLoggedIn) {
      // In a real app, this would fetch the user data from an API or token
      // For demo purposes, we'll create a dummy user
      setUser({
        id: "user123",
        username: "demo_user",
        email: "user@example.com",
        role: "freelancer",
        profile: {
          profileImageUrl: "https://i.pravatar.cc/150?img=12",
          title: "Full Stack Developer"
        }
      });
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("freelancehub_loggedIn");
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
