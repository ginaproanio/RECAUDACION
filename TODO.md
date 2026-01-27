# Reestructuración del Proyecto Sistema de Recaudación

## Objetivo
Optimizar la estructura de carpetas para evitar problemas en actualizaciones de repositorio y despliegues en Railway. Separar claramente frontend y backend en un monorepo.

## Estructura Actual
```
C:\Recaudacion\
├── package.json (root monorepo)
├── Sistemarecaudacion\ (frontend con backend anidado)
│   ├── package.json
│   ├── src\
│   ├── backend\ (problema: backend dentro de frontend)
│   └── ...
```

## Estructura Propuesta
```
C:\Recaudacion\
├── package.json (root monorepo)
├── frontend\ (renombrado de Sistemarecaudacion)
│   ├── package.json
│   ├── src\
│   └── ...
├── backend\ (movido desde frontend)
│   ├── package.json
│   ├── models\
│   ├── routes\
│   └── ...
├── docs\ (documentación)
│   ├── README.md
│   ├── MANUAL_TECNICO.md
│   └── ...
└── .gitignore
```

## Tareas Pendientes
- [x] Renombrar `Sistemarecaudacion` a `frontend`
- [x] Mover `backend` desde `frontend/backend` a `backend/`
- [x] Crear carpeta `docs/` y mover archivos de documentación
- [x] Actualizar `workspaces` en `package.json` root
- [x] Actualizar scripts en `package.json` root
- [x] Actualizar rutas en archivos de configuración (vite.config.ts, railway.toml, etc.)
- [x] Verificar y actualizar .gitignore
- [x] Probar instalación y ejecución después de cambios
- [x] Analizar estructura para verificar no hay duplicados
