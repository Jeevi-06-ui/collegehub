"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { clearAuthToken, getApiErrorMessage, setAuthToken } from "@/lib/api-client";
import type { User } from "@/lib/types";

type Credentials = {
  email: string;
  password: string;
};

type SignupPayload = Credentials & {
  name: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: Credentials) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.profile,
    retry: false
  });

  useEffect(() => {
    if (profileQuery.data?.user) {
      setUser(profileQuery.data.user);
    }
    if (profileQuery.isError) {
      setUser(null);
    }
  }, [profileQuery.data, profileQuery.isError]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: profileQuery.isLoading,
      isAuthenticated: Boolean(user),
      login: async (payload) => {
        try {
          const response = await authApi.login(payload);
          setAuthToken(response.token);
          setUser(response.user);
          queryClient.setQueryData(["profile"], { success: true, user: response.user });
          toast.success("Welcome back");
          return response.user;
        } catch (error) {
          toast.error(getApiErrorMessage(error));
          throw error;
        }
      },
      signup: async (payload) => {
        try {
          const response = await authApi.signup(payload);
          setAuthToken(response.token);
          setUser(response.user);
          queryClient.setQueryData(["profile"], { success: true, user: response.user });
          toast.success("Account created");
          return response.user;
        } catch (error) {
          toast.error(getApiErrorMessage(error));
          throw error;
        }
      },
      logout: async () => {
        await authApi.logout();
        clearAuthToken();
        setUser(null);
        queryClient.removeQueries({ queryKey: ["profile"] });
        toast.success("Logged out");
      },
      refreshProfile: async () => {
        const result = await profileQuery.refetch();
        if (result.data?.user) {
          setUser(result.data.user);
        }
      }
    }),
    [profileQuery, queryClient, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
