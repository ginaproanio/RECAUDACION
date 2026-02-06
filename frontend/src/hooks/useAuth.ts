import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { UserData, authApi } from '../services/api';
import { mockUsers } from '../services/mocks';

interface UseAuthReturn {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cedula: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  isDemoMode: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const isAuthenticated = !!user;

  const login = useCallback(async (cedula: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(cedula, password);
      setUser(response.user);
      setIsDemoMode(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';

      // Si el backend no está disponible o hay error de servidor, usar modo demo
      if (errorMessage.includes('Backend no disponible') || errorMessage.includes('fetch') ||
          errorMessage.includes('Error interno del servidor') || errorMessage.includes('500') ||
          errorMessage.includes('Failed to fetch')) {
        console.log('🔄 Activando modo demostración...');

        // Buscar usuario en mocks
        const mockUser = mockUsers.find(u => u.cedula === cedula.trim());
        
        // PERMITIR ACCESO DEMO: Si es el usuario mock O si es cualquier usuario y el backend está muerto
        if (password === 'demo123') {
          // Convertir mock user a UserData (asegurar tipos compatibles)
          const userToUse = mockUser || mockUsers[0]; // Fallback al primer mock si no encuentra
          
          const userData: UserData = {
            id: userToUse.id,
            cedula: cedula.trim(), // Usar la cédula ingresada
            nombres: userToUse.nombres,
            apellidos: userToUse.apellidos,
            email: userToUse.email,
            celular: userToUse.celular,
            fechaNacimiento: userToUse.fechaNacimiento,
            tieneDiscapacidad: userToUse.tieneDiscapacidad,
            porcentajeDiscapacidad: userToUse.porcentajeDiscapacidad || undefined,
            tipoDiscapacidad: userToUse.tipoDiscapacidad || undefined,
            codigos: userToUse.codigos.map(c => ({ id: c.valor, valor: c.valor, descripcion: c.valor })),
            documents: [],
          };
          setUser(userData);
          setIsDemoMode(true);
          toast.success(mockUser ? 'Modo demostración activado.' : 'Modo Demo: Usuario genérico activado.');
          return;
        } else {
          setError('Credenciales inválidas. En modo demo usa contraseña: demo123');
          throw new Error('Credenciales inválidas');
        }
      } else {
        setError(errorMessage);
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setError(null);
    setIsDemoMode(false);
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
    isDemoMode,
  };
};
