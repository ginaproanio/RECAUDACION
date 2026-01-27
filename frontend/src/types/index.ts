export type UserData = {
  id: string;
  cedula: string;
  password?: string;
  nombres: string;
  apellidos: string;
  email: string;
  celular: string;
  fechaNacimiento: string;
  tieneDiscapacidad: boolean;
  codigos: CodeItem[];
  documents: UserDocument[];
};

export type UserDocument = {
  id: string;
  name: string;
  type: string;
  size?: string;
  uploadDate: string;
  status: 'pending' | 'verified';
};

export type CodeItem = {
  id: string;
  valor: string;
  descripcion: string;
};

export type RubroDefinition = {
  id: string;
  nombre: string;
  montoDefecto: number;
  aplicaDescuento: boolean;
  porcentajeDescuento: number;
};

export type Debt = {
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
};
