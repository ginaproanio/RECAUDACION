import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Debt, debtsApi, paymentsApi } from '../services/api';

interface UseDebtsReturn {
  debts: Debt[];
  isLoading: boolean;
  error: string | null;
  loadDebts: () => Promise<void>;
  processPayment: (debtIds: string[]) => Promise<{
    success: boolean;
    transactionId?: string;
    message?: string;
    paidDebts?: number;
  }>;
  refreshDebts: () => Promise<void>;
}

export const useDebts = (): UseDebtsReturn => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDebts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userDebts = await debtsApi.getUserDebts();
      setDebts(userDebts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar deudas';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processPayment = useCallback(async (debtIds: string[]) => {
    setError(null);

    try {
      const response = await paymentsApi.processPayment(debtIds);
      if (response.success) {
        // Refresh debts after successful payment
        await loadDebts();
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pago';
      setError(errorMessage);
      throw err;
    }
  }, [loadDebts]);

  const refreshDebts = useCallback(async () => {
    await loadDebts();
  }, [loadDebts]);

  return {
    debts,
    isLoading,
    error,
    loadDebts,
    processPayment,
    refreshDebts,
  };
};
