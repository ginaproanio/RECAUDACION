
# Sistema de Recaudación Genérico

Sistema de gestión de recaudación genérico para organizaciones y empresas. Permite la administración de usuarios, generación masiva de deudas, pagos en línea y gestión documental.

## Arquitectura

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + PostgreSQL + Sequelize
- **Despliegue:** Railway (Frontend y Backend separados)
- **Pagos:** Integración con PayPhone

## Funcionalidades Principales

### Para Administradores
- Gestión de usuarios (CRUD, carga masiva CSV)
- Gestión de rubros (conceptos de cobro)
- Generación masiva de deudas por rubro y período
- Simulación de acceso como usuario
- Dashboard administrativo

### Para Contribuyentes
- Consulta de obligaciones pendientes
- Pago en línea con PayPhone
- Historial de pagos
- Expediente digital (subida de documentos)

## Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- PostgreSQL (local o Railway)
- npm o yarn

### Desarrollo Local

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd recaudacion
   ```

2. **Configurar Backend**
   ```bash
   cd backend
   npm install
   # Configurar .env.local con DATABASE_URL de PostgreSQL local
   npm run db:migrate
   npm start
   ```

3. **Configurar Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Modo Demostración

Si el backend no está disponible, el sistema automáticamente activa el modo demostración:
- Usuario: `1712345678` (o cualquier cédula de mock)
- Contraseña: `demo123`

## Documentación

- [Manual Técnico](./MANUAL_TECNICO.md)
- [Flujos de Usuario](./USER_FLOWS.md)
- [Configuración Railway](./configuracion_railway.md)

## Estado del Proyecto

✅ **Implementado:**
- Autenticación completa (JWT)
- Base de datos PostgreSQL con migraciones
- API REST completa
- Frontend responsivo con componentes modulares
- Integración PayPhone
- Modo demostración para desarrollo

🔄 **En Desarrollo:**
- Validación avanzada con Zod
- Estado global con Zustand
- Pruebas unitarias
- CI/CD completo
  