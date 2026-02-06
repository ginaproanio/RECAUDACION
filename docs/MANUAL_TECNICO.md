# Manual Técnico del Sistema de Recaudación

**Versión:** 1.0 (Arquitectura Funcional)
**Fecha de Actualización:** Diciembre 2024
**Estado:** Sistema Funcional con Backend Integrado
**Tecnología:** React + TypeScript (Frontend), Node.js + Express (Backend), PostgreSQL (Base de Datos)

---

## 📊 ESTADO ACTUAL DE IMPLEMENTACIÓN

### ✅ IMPLEMENTADO (Sistema Funcional)
- **Frontend:** React + TypeScript con componentes modulares, lazy loading, error boundaries
- **Backend:** Node.js + Express con autenticación JWT.
- **Base de Datos:** Modelos Sequelize definidos, rutas API implementadas
- **Seguridad:** JWT con middleware, autenticación completa
- **UI/UX:** Dashboard institucional con navegación, tablas de datos, formularios
- **Integración:** APIs funcionales para usuarios, deudas, pagos, rubros
- **Modo Demostración:** Fallback automático cuando backend no está disponible

### ⚠️ PUNTOS CRÍTICOS / BLOQUEANTES ACTUALES
- **Conexión a Base de Datos Local:** El archivo `.env` de producción usa una URL interna de Railway (`postgres.railway.internal`) que **no es accesible desde entornos locales**. Para desarrollo local, se requiere la URL pública de Railway.
- **Validación de Registro:** El registro de usuarios requiere estrictamente que el array `codigos` no esté vacío.
- Encriptación de contraseñas con bcrypt
- Validación avanzada con Zod
- Gestión de estado global (Zustand/React Query)
- Pruebas unitarias e integración
- CI/CD y monitoreo

### 🎯 FUNCIONALIDADES CORE OPERATIVAS
- Autenticación completa (login/logout)
- Gestión de usuarios (CRUD, carga masiva CSV)
- Gestión de rubros (CRUD)
- Generación de deudas masiva
- Portal cliente (ver/pagar deudas)
- Historial de pagos
- Subida de documentos

---

## 1. Arquitectura y Diseño Visual

El sistema ha evolucionado hacia una arquitectura de **Dashboard Institucional**, abandonando patrones de aplicaciones de consumo masivo para adoptar estándares de sistemas ERP/Financieros.

### 1.1. Sistema de Diseño (Enterprise UI)
*   **Paleta de Colores:**
    *   **Primario:** Azul Institucional Profundo (`#003366` / `bg-[#003366]`). Transmite solidez y confianza bancaria.
    *   **Secundario/Interacción:** Azul Cobalto (`#004aad`). Para botones y estados activos.
    *   **Fondo:** Gris Humo (`bg-slate-100`) para maximizar el contraste con las tablas de datos blancas.
    *   **Acción Crítica (Pago):** Naranja (`bg-orange-600`) para botones de "Pagar", siguiendo patrones de conversión.
*   **Geometría:** Bordes rectos o sutilmente redondeados (`rounded-sm`), eliminando el aspecto "infantil" de bordes muy curvos.
*   **Visualización de Datos:** Uso exclusivo de **Tablas de Alta Densidad (Data Grids)** en lugar de tarjetas. La información financiera requiere comparabilidad lineal.

### 1.2. Layout y Navegación
*   **Sidebar Vertical (Colapsable):**
    *   Ancho reducido (`w-48` expandido / `w-20` colapsado) para priorizar el área de trabajo.
    *   Menú de navegación claro con iconos y texto en mayúsculas.
    *   Pie de sidebar exclusivo para el botón de **Salir**.
*   **Header del Workspace:**
    *   Contiene el botón de **Colapso de Menú (Hamburguesa)** a la izquierda.
    *   Muestra "Migas de Pan" (Breadcrumbs) para ubicación contextual.
    *   Perfil de usuario y notificaciones ubicados a la derecha, siguiendo el estándar web.
*   **Unificación:** Tanto el módulo de **Administrador** como el de **Cliente** comparten exactamente el mismo componente de Layout (`DashboardLayout`), garantizando coherencia visual.

### 1.3. Estrategia de Persistencia (Base de Datos)
*   **Motor:** PostgreSQL Exclusivo. Se ha eliminado el soporte para SQLite para garantizar paridad total entre desarrollo y producción.
*   **Ciclo de Vida:** "Migration-First". La estructura de la base de datos se gestiona **exclusivamente** a través de migraciones de Sequelize (`npm run db:migrate`).
*   **Restricción Crítica:** Está prohibido el uso de `sequelize.sync({ force: true })` o `alter: true` en el código de arranque, ya que esto desalinea la base de datos de las migraciones controladas.
*   **Conectividad:** Para desarrollo local, **NO** usar la variable `DATABASE_URL` interna de Railway. Usar la URL de conexión pública (TCP Proxy) proporcionada por el dashboard de Railway.

---

## 2. Modelos de Datos (Nomenclatura Estricta)

Se ha aplicado una política de **Alineación Semántica Absoluta**. No existen términos ambiguos.

### 2.1. Deuda (`Debt`)
Reemplaza a cualquier término como "emisión", "issue" o "record".
*   `montoBase`: Valor original del rubro.
*   `porcentajeDescuentoAplicado`: % calculado según reglas de negocio (3ra edad/discapacidad).
*   `descuentoValor`: Dinero descontado.
*   `montoFinal`: Valor real a pagar por el usuario.
*   `estado`: `pendiente` | `pagado`.

### 2.2. Usuario (`UserData`)
*   `codigos`: Array de objetos que representan Lotes, Medidores o Matrículas.
*   `fechaNacimiento`: Dato crítico para el cálculo automático de subsidios.

### 2.3. Rubro (`RubroDefinition`)
*   Configuración maestra de conceptos de cobro (Ej: "Alicuota 2024").
*   Define si el concepto *permite* descuentos, no a quién se le aplican.

---

## 3. Módulos del Sistema

### 3.1. Administración (Restaurado y Completo)
A pesar de la actualización visual, se mantiene la integridad funcional total.

*   **Generación de Deudas (Motor de Emisión):**
    *   Permite generar obligaciones por:
        *   **Periodicidad:** Mensual (1 mes), Cuotas (N meses a futuro) o Rango (Inicio-Fin).
        *   **Alcance:** Masivo (Todos los usuarios con códigos) o Individual (Código específico).
    *   **Prevención de Duplicidad:** El motor valida `(usuario + rubro + periodo + codigo)` antes de crear.
*   **Catálogo de Rubros (CRUD):**
    *   Creación y edición de conceptos de cobro.
    *   Bloqueo de eliminación si existen deudas históricas asociadas.
*   **Padrón de Usuarios (CRUD):**
    *   Registro manual con validación de al menos un código.
    *   **Carga Masiva CSV:** Procesa texto plano para altas rápidas.
    *   **Simulación de Acceso:** Botón (Ojo) para entrar al portal como un usuario específico sin contraseña.

### 3.2. Portal del Usuario (Cliente)
*   **Obligaciones (Deudas):**
    *   Tabla interactiva con selección múltiple.
    *   Resumen financiero (KPIs) en la parte superior.
    *   Botón de pago integrado.
*   **Historial:**
    *   Registro inmutable de pagos realizados.
    *   Descarga de comprobantes (PDF simulado).
*   **Expediente Digital:**
    *   Carga de documentos PDF/IMG para validación administrativa.

---

## 4. Reglas de Negocio Implementadas

1.  **Cálculo de Descuentos:**
    *   Se ejecuta **únicamente** en el momento de la generación de la deuda.
    *   Fórmula: `Si (Edad >= 65 OR Discapacidad) AND (Rubro.aplicaDescuento) ENTONCES Descuento = Rubro.porcentaje`.
2.  **Integridad Referencial:**
    *   No se puede eliminar un Usuario si tiene deudas.
    *   No se puede eliminar un Rubro si tiene deudas.
3.  **Seguridad de Acceso:**
    *   Login valida contra Cédula y Contraseña exactas (con limpieza de espacios en blanco).
    *   Sesión persiste en memoria de la SPA (estado de React).

---

## 5. Solución de Problemas Comunes (Troubleshooting)

### 5.1. Error de Conexión / Login Fallido en Local
*   **Síntoma:** El login gira indefinidamente o devuelve error 500/Network Error.
*   **Causa:** El backend local intenta conectar a `postgres.railway.internal`.
*   **Solución:** Cambiar `DATABASE_URL` en `.env` local por la URL pública de Railway (`postgresql://...roundhouse.proxy.rlwy.net...`).

---

**Nota Técnica:** Este documento es la única fuente de verdad. Cualquier discrepancia con documentos anteriores ("manual_tecnico_funcional.md") se resuelve a favor de este archivo y del código fuente actual en `/src/app/App.tsx`.
