import { useState, useCallback } from 'react';
import { UserData, usersApi } from '../services/api';

interface UseUsersReturn {
  users: UserData[];
  isLoading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  createUser: (userData: Partial<UserData>) => Promise<UserData>;
  bulkCreateUsers: (csvData: string) => Promise<UserData[]>;
  deleteUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allUsers = await usersApi.getAll();
      setUsers(allUsers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: Partial<UserData>) => {
    setError(null);

    try {
      const newUser = await usersApi.create(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const bulkCreateUsers = useCallback(async (csvData: string) => {
    setError(null);

    try {
      const newUsers = await usersApi.bulkCreate(csvData);
      setUsers(prevUsers => [...prevUsers, ...newUsers]);
      return newUsers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuarios masivamente';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setError(null);

    try {
      await usersApi.delete(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    await loadUsers();
  }, [loadUsers]);

  return {
    users,
    isLoading,
    error,
    loadUsers,
    createUser,
    bulkCreateUsers,
    deleteUser,
    refreshUsers,
  };
};
