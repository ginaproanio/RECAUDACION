# Flujos de Usuario y Casos de Uso

## 1. Flujo de Autenticación

### 1.1. Login
- **Actor:** Usuario (Admin o Cliente)
- **Entrada:** Cédula y Contraseña.
- **Validación:**
  - Cédula válida (formato ecuatoriano).
  - Campos no vacíos.
- **Éxito:** Redirección a `/dashboard` (si es Admin) o `/portal` (si es Cliente). Token JWT almacenado.
- **Error:** Mensaje "Credenciales inválidas".
- **Modo Demostración:** Si el backend no está disponible, el sistema activa automáticamente el modo demo con usuarios mock (contraseña: demo123).

### 1.2. Registro (Solo Admin)
- **Actor:** Administrador
- **Acción:** Crear nuevo usuario manualmente o carga masiva CSV.
- **Regla Crítica:** Todo usuario debe tener al menos un código de propiedad (`codigos`).

## 2. Flujo de Administración (Gestión de Deudas)

### 2.1. Generación Masiva
- **Actor:** Administrador
- **Pantalla:** Generador de Deudas.
- **Pasos:**
  1. Seleccionar Rubro (ej. "Alicuota Enero").
  2. Definir Periodo (Mes/Año).
  3. Seleccionar Alcance: "Todos" o "Código Específico".
  4. Confirmar Generación.
- **Resultado:** El sistema crea registros `Debt` para cada usuario elegible, aplicando descuentos automáticamente si corresponde.

## 3. Flujo del Cliente (Pago)

### 3.1. Consulta de Deudas
- **Actor:** Cliente
- **Pantalla:** Mis Obligaciones.
- **Visualización:** Tabla con deudas pendientes.
- **Acción:** Seleccionar una o varias deudas (Checkbox).

### 3.2. Pago con PayPhone
- **Actor:** Cliente
- **Acción:** Clic en "Pagar".
- **Proceso:**
  1. Redirección a pasarela PayPhone.
  2. Ingreso de tarjeta.
  3. Retorno a sistema con estado "Aprobado".
  4. Actualización automática de estado de deuda a `pagado`.