import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, Student } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  student: Student | null;
  login: (user: User, student?: Student) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data.user);
        if (data.student) {
          setStudent(data.student);
        }
      } catch {
        // Session invalid or network error
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData: User, studentData?: Student) => {
    setUser(userData);
    if (studentData) {
      setStudent(studentData);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore errors
    }
    setUser(null);
    setStudent(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        login,
        logout,
        isAuthenticated: !!user,
        isTeacher: user?.role === "teacher",
        isStudent: user?.role === "student",
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
