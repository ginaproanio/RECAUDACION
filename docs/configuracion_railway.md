# CONFIGURACIÓN DETALLADA EN RAILWAY PARA EL SISTEMA DE RECAUDACIÓN

Este es un sistema de recaudación donde el administrador genera deudas, el usuario ve las deudas y las paga mediante PayPhone. El diseño está en Figma, subido a GitHub y desplegado estrictamente en Railway.

Este documento detalla la configuración necesaria en Railway para desplegar el sistema de recaudación basado en Node.js (Express para backend, React para frontend) y PostgreSQL para la base de datos.

## 1. Servicio de Aplicación (Backend + Frontend)

**Tipo:** Web Service  
**Fuente:** Repositorio GitHub `ginaproanio/Recaudacion`  
**Rama:** main (o la rama por defecto)

### Configuración del Servicio:

**Build Command:**  
```
npm install && npm run build
```
- Esto instala las dependencias y construye el frontend (React) para producción.

**Start Command:**  
```
npm start
```
- Inicia el servidor Express que sirve tanto el backend como el frontend construido.

**Puerto:** Automático (`$PORT`)  
- Railway asigna automáticamente el puerto; el código debe escuchar en `process.env.PORT`.

**Variables de Entorno Adicionales (si es necesario):**  
- Asegurarse de que el backend use `process.env.PORT` para el puerto.

### Estructura del Proyecto Esperada:
- `/backend`: Código del servidor Express (API REST).
- `/frontend`: Aplicación React.
- `/package.json`: Scripts para build y start.
- `/dist` o `/build`: Carpeta generada por el build del frontend.

## 2. Servicio de Base de Datos

**Tipo:** PostgreSQL (Railway Plugin)  

### Configuración:

1. Crear un nuevo plugin de PostgreSQL en Railway.
2. Railway genera automáticamente la variable de entorno `DATABASE_URL` con la cadena de conexión completa (incluye host, puerto, usuario, contraseña, base de datos).

### Conexión en el Backend:
- Usar la librería `pg` o `sequelize` para conectar a PostgreSQL.
- En el código, conectar usando `process.env.DATABASE_URL`.
- Ejecutar migraciones automáticamente al desplegar (ver sección de scripts).

### Migraciones y Seeds:
- Incluir scripts en `package.json` para ejecutar migraciones al deploy, por ejemplo:
  ```
  "postinstall": "npm run migrate"
  ```
- Crear tablas necesarias: usuarios, pagos, etc.

## 3. Variables de Entorno (Environment Variables)

Configurar en Railway → Variables (en el servicio de aplicación):

```
APP_ENV=production
PAYPHONE_ENV=production
PAYPHONE_APP_ID=<tu_app_id>
PAYPHONE_CLIENT_ID=<tu_client_id>
PAYPHONE_SECRET_KEY=<tu_secret_key>
PAYPHONE_ENCRYPTION_PASSWORD=<tu_encryption_password>
PAYPHONE_TOKEN_1793214995001=<tu_token>
PAYPHONE_DOMAIN=<tu_dominio>
PAYPHONE_RESPONSE_URL=<url_de_respuesta_para_confirmaciones>
DATABASE_URL=<generado_automaticamente_por_railway_postgres>
```

- **Notas:**
  - Reemplazar los valores de PayPhone con las claves reales del archivo `.env` local.
  - `DATABASE_URL` se genera automáticamente al crear el plugin PostgreSQL; no lo configures manualmente.
  - Asegurar que estas variables estén marcadas como "secretas" en Railway para seguridad.

## 4. Pasos para Desplegar en Railway

1. **Conectar el Repositorio:**
   - En Railway, crear un nuevo proyecto.
   - Conectar al repositorio GitHub `ginaproanio/Recaudacion`.

2. **Agregar Servicios:**
   - Agregar Web Service (aplicación).
   - Agregar PostgreSQL Plugin.

3. **Configurar Variables de Entorno:**
   - En el Web Service, agregar las variables listadas arriba.

4. **Despliegue Automático:**
   - Cada push a la rama main activará un nuevo despliegue.
   - Railway ejecutará el Build Command, luego Start Command.

5. **Verificación:**
   - Una vez desplegado, verificar que la aplicación esté corriendo en la URL proporcionada por Railway.
   - Probar la integración con PayPhone y la generación de comprobantes.

## 5. Consideraciones Adicionales

- **Dominio Personalizado:** Opcionalmente, configurar un dominio personalizado en Railway.
- **Logs:** Monitorear logs en Railway para debugging.
- **Escalabilidad:** Railway maneja escalado automático si es necesario.
- **Seguridad:** Asegurar que todas las credenciales sensibles estén en variables de entorno, no en el código.
- **Backup de DB:** Railway proporciona backups automáticos para PostgreSQL.

Esta configuración asegura un despliegue seguro y eficiente del sistema de recaudación en Railway.
