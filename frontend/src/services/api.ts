/// <reference types="vite/client" />
const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || 'http://localhost:3001/api')
  : '/api'; // En producción, usar rutas relativas para que pasen por el proxy

// Types for API responses
export interface UserData {
  id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  celular: string;
  fechaNacimiento: string;
  tieneDiscapacidad: boolean;
  porcentajeDiscapacidad?: number;
  tipoDiscapacidad?: string;
  codigos: CodeItem[];
  documents: UserDocument[];
}

export interface CodeItem {
  id: string;
  valor: string;
  descripcion: string;
}

export interface UserDocument {
  id: string;
  name: string;
  type: string;
  size?: string;
  uploadDate: string;
  status: 'pending' | 'verified';
}

export interface Debt {
  id: string;
  usuarioId: string;
  codigoValor: string;
  rubroId: string;
  nombreRubro: string;
  periodo: string;
  montoBase: number;
  porcentajeDescuentoAplicado: number;
  descuentoValor: number;
  montoFinal: number;
  estado: 'pendiente' | 'pagado';
  paymentDate?: string;
  transactionId?: string;
  monthIndex: number;
  year: number;
}

export interface RubroDefinition {
  id: string;
  nombre: string;
  montoDefecto: number;
  aplicaDescuento: boolean;
  porcentajeDescuento: number;
}

export interface AuthResponse {
  token: string;
  user: UserData;
}

export interface ApiError {
  error: string;
}

// API utility functions
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setAuthToken(data.token);
      return data.token;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  return null;
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  let token = getAuthToken();

  // Check if token is expired and refresh if needed
  if (token && isTokenExpired(token)) {
    const newToken = await refreshToken();
    if (newToken) {
      token = newToken;
    } else {
      // Token refresh failed, user needs to login again
      removeAuthToken();
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(errorData.error);
  }

  return response.json();
};

// Auth API
export const authApi = {
  login: async (cedula: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ cedula, password }),
    });
    setAuthToken(response.token);
    return response;
  },

  register: async (userData: Partial<UserData> & { password: string }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(response.token);
    return response;
  },

  logout: (): void => {
    removeAuthToken();
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<UserData[]> => {
    return apiRequest<UserData[]>('/users');
  },

  create: async (userData: Partial<UserData>): Promise<UserData> => {
    return apiRequest<UserData>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  bulkCreate: async (csvData: string): Promise<UserData[]> => {
    return apiRequest<UserData[]>('/users/bulk', {
      method: 'POST',
      body: JSON.stringify({ csvData }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Debts API
export const debtsApi = {
  getUserDebts: async (): Promise<Debt[]> => {
    return apiRequest<Debt[]>('/debts');
  },
};

// Payments API
export const paymentsApi = {
  processPayment: async (debtIds: string[]): Promise<{
    success: boolean;
    transactionId?: string;
    message?: string;
    paidDebts?: number;
  }> => {
    return apiRequest('/payments/process', {
      method: 'POST',
      body: JSON.stringify({ debtIds }),
    });
  },

  getPaymentHistory: async (): Promise<any[]> => {
    return apiRequest('/payments/history');
  },
};

// Rubros API
export const rubrosApi = {
  getAll: async (): Promise<RubroDefinition[]> => {
    return apiRequest<RubroDefinition[]>('/rubros');
  },

  create: async (rubroData: Partial<RubroDefinition>): Promise<RubroDefinition> => {
    return apiRequest<RubroDefinition>('/rubros', {
      method: 'POST',
      body: JSON.stringify(rubroData),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/rubros/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminApi = {
  generateDebts: async (data: {
    rubroId: string;
    mes: number;
    anio: number;
  }): Promise<{ success: boolean; generatedCount: number }> => {
    return apiRequest('/admin/generate-debts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
