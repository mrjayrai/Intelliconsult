"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  DOB: string;
  city: string;
  role: "consultant" | "manager";
  isActive: boolean;
  onBench?: boolean;
  imageUrl?: string;
  DOJ: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  message: string;
  user: User;
  // Add `token` here if you return it later
}

interface AuthContextType {
  authData: LoginResponse | null;
  setAuthData: (data: LoginResponse | null) => void;
  isManager: boolean;
  isConsultant: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<LoginResponse | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("authData");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("authData");
  };

  useEffect(() => {
    if (authData) {
      localStorage.setItem("authData", JSON.stringify(authData));
    }
  }, [authData]);

  const role = authData?.user?.role;
  const isManager = role === "manager";
  const isConsultant = role === "consultant";

  return (
    <AuthContext.Provider
      value={{ authData, setAuthData, isManager, isConsultant, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
