# TODO: Mejora del Sistema de Recaudación

## RESTRUCTURACIÓN COMPLETADA ✅
**Estructura optimizada para evitar problemas en Railway:**
- `frontend/` (renombrado de Sistemarecaudacion)
- `backend/` (movido desde frontend/backend)
- `docs/` (documentación centralizada)

## FASE 0: ESTABILIZACIÓN (FRONTEND + CONTRATOS + MOCKS)
- [x] Descomponer App.tsx en componentes modulares (AuthScreen, AdminModule, ClientModule)
- [x] Limpiar funcionalidades ilusorias (botones falsos, estados fake, drag&drop mock)
- [x] Preparar componentes para integración backend
- [ ] Crear contratos de API (interfaces TypeScript para endpoints)
- [ ] Implementar mocks completos para desarrollo sin backend
- [ ] Estabilizar navegación y estado local
- [ ] Documentar flujos de usuario y casos de uso

## FASE 1: BACKEND REAL (JWT + BASE DE DATOS)
- [x] Implementar middleware JWT reutilizable (authenticateToken, requireAdmin)
- [x] Crear rutas de autenticación completas (/register, /login, /verify)
- [x] Eliminar fallbacks inseguros de JWT_SECRET
- [ ] Normalizar modelos de datos (Debt con periodoMes/periodoAnio, asociaciones con CASCADE/RESTRICT)
- [ ] Crear endpoints REST completos: /api/users, /api/debts, /api/rubros, /api/payments, /api/documents
- [ ] Implementar validación con Zod en backend
- [ ] Agregar manejo de errores global y logging
- [ ] Implementar encriptación de contraseñas con bcrypt
- [ ] Documentar puntos de integración API

## FASE 2: INTEGRACIÓN FRONTEND-BACKEND
- [ ] Implementar enrutamiento con React Router
- [ ] Separar lógica de negocio en hooks y servicios API
- [ ] Crear servicios API completos
- [ ] Actualizar AuthScreen con autenticación real
- [ ] Migrar ClientModule a API real (pagos funcionales)
- [ ] Migrar AdminModule a API real (usuarios, rubros, generación de deudas)
- [ ] Actualizar App.tsx para usar APIs reales (eliminado estado local)
- [ ] Implementar React Router completo con rutas protegidas
- [ ] Crear hooks personalizados para llamadas API
- [ ] Conectar todos los componentes a endpoints reales
- [ ] Implementar manejo de errores en frontend

## FASE 3: GESTIÓN DE DATOS Y ESTADO
- [ ] Completar modelos Sequelize con índices y validaciones
- [ ] Implementar consultas reales a PostgreSQL
- [ ] Agregar estado global con Zustand
- [ ] Implementar React Query para cache y sincronización
- [ ] Crear migraciones de base de datos

## FASE 4: CALIDAD DE CÓDIGO Y SEGURIDAD
- [ ] Mejorar TypeScript (eliminar any, tipos estrictos)
- [ ] Agregar validación con Zod en frontend
- [ ] Implementar pruebas unitarias con Jest
- [ ] Implementar pruebas de integración
- [ ] Agregar pruebas E2E con Cypress
- [ ] Implementar encriptación de datos sensibles
- [ ] Configurar CORS y headers de seguridad
- [ ] Implementar rate limiting

## FASE 5: OPTIMIZACIÓN Y RENDIMIENTO
- [ ] Implementar lazy loading y code splitting
- [ ] Optimizar componentes con React.memo y useMemo
- [ ] Agregar service worker para PWA
- [ ] Implementar virtualización para listas grandes
- [ ] Optimizar imágenes y assets
- [ ] Configurar bundle analyzer

## FASE 6: DESPLIEGUE Y MONITOREO
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Configurar despliegue en Railway
- [ ] Gestionar variables de entorno seguras
- [ ] Implementar logging centralizado
- [ ] Configurar monitoreo con Sentry
- [ ] Implementar health checks
- [ ] Configurar backups automáticos de base de datos

---

**NOTAS IMPORTANTES:**
- Railway y base de datos PostgreSQL están CONGELADOS hasta FASE 1 completada
- Prioridad: Estabilizar frontend con mocks antes de tocar backend real
- JWT y autenticación real se implementan en FASE 1, no antes
- Mantener separación clara entre fases para evitar caos
- **RESTRUCTURACIÓN:** Estructura de carpetas optimizada para despliegues exitosos
