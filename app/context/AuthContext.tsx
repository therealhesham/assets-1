// // app/context/AuthContext.tsx
// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: string | null;
//   login: (empid: string, password: string) => Promise<void>;
//   logout: () => void;
//   error: string;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [user, setUser] = useState<string | null>(null);
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true); // افتراضيًا true حتى يتم التحقق
//   const router = useRouter();

//   // التحقق من حالة المصادقة عند تحميل التطبيق
//   useEffect(() => {
//     const checkAuth = () => {
//       const authStatus = sessionStorage.getItem("isAuthenticated");
//       const storedUser = localStorage.getItem("name");
//       if (authStatus === "true" && storedUser) {
//         setIsAuthenticated(true);
//         setUser(storedUser);
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//       setLoading(false);
//     };
//     checkAuth();
//   }, []);

//   const login = async (empid: string, password: string) => {
//     setError("");
//     setLoading(true);
  
//     try {
//       const res = await fetch("/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ empid, password }),
//       });
  
//       const data = await res.json();
  
//       if (!res.ok) {
//         throw new Error(data.error || "كلمة المرور أو الرقم التعريفي غير صحيح");
//       }
  
//       setIsAuthenticated(true);
//       setUser(data.user.name);
//       sessionStorage.setItem("isAuthenticated", "true");
//       localStorage.setItem("name", data.user.name);
//       localStorage.setItem("userId", data.user.id); // إضافة هذا السطر لتخزين id
//       setError("");
//       router.push("/");
//       router.refresh();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     sessionStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("name");
//     setIsAuthenticated(false);
//     setUser(null);
//     setError("");
//     router.push("/");
//     router.refresh();
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout, error, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };  
// app/context/AuthContext.tsx
// app/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (empid: string, password: string) => Promise<void>;
  logout: () => void;
  error: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem("isAuthenticated");
      const storedUser = localStorage.getItem("name");
      const storedUserId = localStorage.getItem("userId");
      if (authStatus === "true" && storedUser && storedUserId) {
        setIsAuthenticated(true);
        setUser(storedUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (empid: string, password: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empid, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "كلمة المرور أو الرقم التعريفي غير صحيح");
      }
      console.log("API Response:", data); // للتحقق من البيانات المُرجعة
      setIsAuthenticated(true);
      setUser(data.user.name);
      sessionStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("name", data.user.name);
      // استخدام empid من الاستجابة إذا كان موجودًا، وإلا استخدام id
      const userId = data.user.empid || data.user.id;
      localStorage.setItem("userId", userId);
      setError("");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("isAuthenticated");
    localStorage.removeItem("name");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUser(null);
    setError("");
    router.push("/");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};