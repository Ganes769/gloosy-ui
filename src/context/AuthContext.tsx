import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, getCurrentUser } from "../services/api";

type AuthStatus = "unauthenticated" | "loading" | "authenticated";
type User = {
  email: string;
  password?: string;
  id: string;
};

type AuthContextType = {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
        // Fetch user data after login
        const userData = await getCurrentUser();
        setUser(userData);
        setStatus("authenticated");
      }
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setUser(null);
      setStatus("unauthenticated");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    getCurrentUser()
      .then((data) => {
        setUser(data);
        setStatus("authenticated");
      })
      .catch(() => {
        setUser(null);
        setStatus("unauthenticated");
        localStorage.removeItem("token");
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
