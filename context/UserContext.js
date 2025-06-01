"use client";

import { verifyAuth } from "@/lib/auth";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await verifyAuth();
        setUser(result?.user ?? null);
      } catch (error) {
        setUser(null);
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
