import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import proxy from 'express-http-proxy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// URL del Backend: En Railway se configura vía variables de entorno. Localmente usa el 3000.
// AUDITORÍA: Usamos BACKEND_URL (para el proxy) o VITE_API_URL (como fallback) limpiando el /api final si existe.
const rawBackendUrl = process.env.BACKEND_URL || process.env.VITE_API_URL || 'http://localhost:3000';
const backendUrl = rawBackendUrl.replace(/\/api\/?$/, ''); // Eliminar /api al final si viene incluido

console.log(`[Arquitectura] Configuración de Proxy:`);
console.log(`- Frontend Port: ${process.env.PORT || 3000}`);
console.log(`- Backend Target: ${backendUrl}`);

// Railway inyecta el puerto automáticamente a través de la variable de entorno PORT
// Usamos 3000 como fallback estándar para coincidir con backend y evitar conflictos de proxy
const port = process.env.PORT || 3000;

// Servir los archivos estáticos generados por el build (carpeta 'dist')
app.use(express.static(path.join(__dirname, 'dist')));

// ARQUITECTURA: Proxy Reverso
// Redirige todas las peticiones /api/* hacia el servicio de Backend.
// Esto conecta el Frontend con el Backend sin exponer la URL del backend al navegador directamente.

// Middleware para logging de proxy (Auditoría de tráfico)
app.use('/api', (req, res, next) => {
  console.log(`[Proxy] Redirigiendo ${req.method} ${req.url} -> ${backendUrl}/api${req.url}`);
  next();
});

app.use('/api', proxy(backendUrl, {
  proxyReqPathResolver: (req) => {
    // Mantiene el prefijo /api al enviar la petición al backend
    return '/api' + req.url;
  }
}));

// Endpoint de salud requerido por Railway (definido en railway.toml)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Manejar cualquier otra ruta devolviendo index.html (para SPA/React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      console.error("Error crítico: No se pudo servir index.html. Verifica si la carpeta 'dist' se generó correctamente.", err);
      res.status(500).send(err);
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Health check endpoint available at /health`);
  console.log(`Serving static files from ${path.join(__dirname, 'dist')}`);
});