import { User, Rubro, Debt } from '../types/api';

// Mocks de Usuarios
export const mockUsers: User[] = [
  {
    id: 'user-123',
    cedula: '1712345678',
    nombres: 'Juan Carlos',
    apellidos: 'Pérez López',
    email: 'juan.perez@example.com',
    celular: '0991234567',
    fechaNacimiento: '1980-05-15',
    tieneDiscapacidad: false,
    codigos: [{ valor: 'LOTE-A1' }, { valor: 'MED-2024' }],
  },
  {
    id: 'user-456',
    cedula: '1787654321',
    nombres: 'María Elena',
    apellidos: 'Gómez',
    email: 'maria.gomez@example.com',
    celular: '0987654321',
    fechaNacimiento: '1950-10-20', // Tercera edad
    tieneDiscapacidad: true,
    porcentajeDiscapacidad: 40,
    tipoDiscapacidad: 'Física',
    codigos: [{ valor: 'LOTE-B5' }],
  }
];

// Mocks de Rubros
export const mockRubros: Rubro[] = [
  {
    id: 'rubro-1',
    nombre: 'Alicuota 2024',
    montoDefecto: 50.00,
    aplicaDescuento: true,
    porcentajeDescuento: 50, // 50% para 3ra edad/discapacidad
  },
  {
    id: 'rubro-2',
    nombre: 'Multa Asamblea',
    montoDefecto: 20.00,
    aplicaDescuento: false, // No aplica descuentos
  }
];

// Mocks de Deudas
export const mockDebts: Debt[] = [
  {
    id: 'debt-1',
    userId: 'user-123',
    rubroId: 'rubro-1',
    codigoValor: 'LOTE-A1',
    periodoMes: 1,
    periodoAnio: 2024,
    montoBase: 50.00,
    porcentajeDescuentoAplicado: 0,
    descuentoValor: 0,
    montoFinal: 50.00,
    estado: 'pendiente',
    user: mockUsers[0],
    rubro: mockRubros[0]
  }
];