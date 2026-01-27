import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { UserData, authApi } from '../services/api';

interface UseAuthReturn {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cedula: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const login = useCallback(async (cedula: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(cedula, password);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setError(null);
  }, []);

  // Check if user is already authenticated on mount
  useEffect(() => {
    if (authApi.isAuthenticated()) {
      // In a real app, you might want to validate the token with the server
      // For now, we'll assume the token is valid if it exists
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    error,
  };
};
