// Definiciones de tipos sincronizadas con los modelos del Backend (Sequelize)

export interface CodigoItem {
  valor: string;
}

export interface User {
  id: string; // UUID
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  celular: string;
  fechaNacimiento: string; // YYYY-MM-DD
  tieneDiscapacidad: boolean;
  porcentajeDiscapacidad?: number | null;
  tipoDiscapacidad?: string | null;
  codigos: CodigoItem[]; // JSONB normalizado
  documents?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Rubro {
  id: string; // UUID
  nombre: string;
  montoDefecto: number; // Decimal
  aplicaDescuento: boolean;
  porcentajeDescuento?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export type EstadoDeuda = 'pendiente' | 'pagado' | 'anulado';

export interface Debt {
  id: string; // UUID
  userId: string;
  rubroId: string;
  codigoValor: string; // El código específico (Lote/Medidor) al que aplica
  periodoMes: number;
  periodoAnio: number;
  montoBase: number;
  porcentajeDescuentoAplicado: number;
  descuentoValor: number;
  montoFinal: number;
  estado: EstadoDeuda;
  payphoneTransactionId?: string | null;
  paymentDate?: string | null;
  comprobanteUrl?: string | null;
  // Relaciones opcionales (expandibles)
  user?: User;
  rubro?: Rubro;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  debtId: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
}